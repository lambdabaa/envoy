Template.game.rendered = function() {
  var game = Session.get('game.game');
  if (!game || game.started) {
    return;
  }

  // Initialize the game.
  game.start();
  Meteor.call('saveGame', game, function() {
    Session.set('game.game', game);
  });
};

Template.game.me = function() {
  var host = Meteor.userId();
  return Meteor.users.getName(host);
};

Template.game.them = function() {
  var game = Session.get('game.game');
  if (!game) {
    return '';
  }

  var opponent = game.getOpponent();
  return Meteor.users.getName(opponent);
};

Template.game.deckCount = function(player) {
  var game = Session.get('game.game');
  if (!game || !game.started) {
    return 0;
  }

  console.log(game);
  var playerId = (player === 'me') ?
    Meteor.userId() :
    game.getOpponent(game);
  console.log(playerId);
  var playerToLibrary = game.playerToLibrary;
  var library = playerToLibrary[playerId];
  return library.length;
};

Template.game.handCount = function(player) {
  var game = Session.get('game.game');
  if (!game || !game.started) {
    return 0;
  }

  var playerId = (player === 'me') ?
    Meteor.userId() :
    game.getOpponent(game);
  var playerToHand = game.playerToHand;
  var hand = playerToHand[playerId];
  return hand.length;
};

Template.game.graveyardCount = function(player) {
  var game = Session.get('game.game');
  if (!game || !game.started) {
    return 0;
  }

  var playerId = (player === 'me') ?
    Meteor.userId() :
    game.getOpponent(game);
  var playerToGraveyard = game.playerToGraveyard;
  var graveyard = playerToGraveyard[playerId];
  return graveyard.length;
};

Template.game.life = function(player) {
  var game = Session.get('game.game');
  if (!game || !game.started) {
    return 0;
  }

  var playerId = (player === 'me') ?
    Meteor.userId() :
    game.getOpponent(game);
  var playerToLife = game.playerToLife;
  var life = playerToLife[playerId];
  return life;
};

Template.game.hand = function() {
  var game = Session.get('game.game');
  if (!game || !game.started) {
    return [];
  }

  var userId = Meteor.userId();
  var playerToHand = game.playerToHand;
  var hand = playerToHand[userId];

  // TODO(gareth): This is a hack. We need to find a way
  //     to identify when the card we just drew ends up in
  //     the document. For now, we are assuming that the
  //     framework call to recompute this function and the
  //     resulting DOM operation(s) occur in the same tick
  //     of the event loop.
  setTimeout(Template.game._addTooltipsToCards, 0);

  return hand;
};

Template.game.field = function(player) {
  var game = Session.get('game.game');
  if (!game || !game.started) {
    return [];
  }

  var playerId = (player === 'me') ?
    Meteor.userId() :
    game.getOpponent(game);
  var playerToField = game.playerToField;
  var field = playerToField[playerId];
  return field;
};

Template.game.inspect = function() {
  return Session.get('game.inspect');
};

/**
 * Create template bindings for each energy color.
 */
[
  'blue',
  'green',
  'purple',
  'red',
  'white'
].forEach(function(color) {
  Template.game[color] = function(player) {
    var game = Session.get('game.game');
    if (!game || !game.started) {
      return 0;
    }

    var playerId = (player === 'me') ?
      Meteor.userId() :
      game.getOpponent(game);
    var playerToEnergyAvailable = game.playerToEnergyAvailable;
    var energy = playerToEnergyAvailable[playerId];
    return energy[color];
  };
});

Template.game._draw = function() {
  var game = Session.get('game.game');
  if (!game || !game.started) {
    return;
  }

  var userId = Meteor.userId();
  var library = game.playerToLibrary[userId];
  if (!library || library.length === 0) {
    return;
  }

  var hand = game.playerToHand[userId];
  hand.push(library.pop());
  Meteor.call('saveGame', game, function() {
    Session.set('game.game', game);
  });
};

Template.game.events({
  'click .deck-me': Template.game._draw,

  'click .board > * > .card': function() {
    Session.set('game.inspect', this);
  },

  'click .hand .card-action': function(event) {
    var element = event.target;
    var id = element.dataset.id;

    // Hide the popover.
    $(element)
      .closest('.popover')
      .toggleClass('in')
      .remove();

    var game = Session.get('game.game');
    var card = game.idToCard[id];

    // Invoke the action.
    var action = element.dataset.action;
    switch (action) {
      case 'play':
        return playCard(card);
      case 'cast':
        return castCard(card);
    }
  }
});

function playCard(card) {
  var game = Session.get('game.game');
  var userId = Meteor.userId();

  // Remove card from hand.
  var playerToHand = game.playerToHand;
  var hand = playerToHand[userId];
  playerToHand[userId] = _.reject(hand, function(value) {
    return value.id === card.id;
  });

  // Put card in play.
  var playerToField = game.playerToField;
  playerToField[userId].push(card);
  Meteor.call('saveGame', game, function() {
    Session.set('game.game', game);
  });
}

function castCard(card) {
  var game = Session.get('game.game');
  var userId = Meteor.userId();

  // Remove card from hand.
  var playerToHand = game.playerToHand;
  var hand = playerToHand[userId];
  playerToHand[userId] = _.reject(hand, function(value) {
    return value.id === card.id;
  });

  // Increment energy counters.
  var playerToEnergy = game.playerToEnergy;
  var energy = playerToEnergy[userId];
  var color = card.color;
  energy[color] += 1;
  var playerToEnergyAvailable = game.playerToEnergyAvailable;
  var energyAvailable = playerToEnergyAvailable[userId];
  energyAvailable[color] += 1;
  Meteor.call('saveGame', game, function() {
    Session.set('game.game', game);
  });
}

// TODO(gareth): This is awful...
Template.game._addTooltipsToCards = function() {
  var game = Session.get('game.game');
  if (!game || !game.started) {
    return;
  }

  var userId = Meteor.userId();
  var playerToHand = game.playerToHand;
  var hand = playerToHand[userId];
  hand.forEach(function(card) {
    var id = card.id;
    var popoverId = 'popover-' + id;
    var selector = '.hand > .card[data-id="' + id + '"]';

    // Clear existing popover.
    $(selector).popover('destroy');

    // Create new popover.
    var popoverHtml =
      '<div id="' + popoverId + '">' +
        '<a href="#" class="card-action" ' +
                    'data-action="play" ' +
                    'data-id="' + id + '">' +
           'Play Card' +
        '</a>' +
        '<br />' +
        '<a href="#" class="card-action" ' +
                    'data-action="cast" ' +
                    'data-id="' + id + '">' +
           'Cast to Energy' +
        '</a>' +
      '</div>';
    $(selector).popover({
      content: popoverHtml,
      html: true,
      placement: 'right',
      trigger: 'click'
    });
  });
};
