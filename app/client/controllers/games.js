/* global Decks, Games */

Template.games.decks = function() {
  return Decks.find();
};

Template.games.games = function() {
  return Games.find();
};

Template.games.host = function(game) {
  var players = game.players;
  var host = players[0];
  return Meteor.users.getName(host);
};

Template.games.opponent = function(game) {
  var players = game.players;
  var opponent = players[1];
  return Meteor.users.getName(opponent);
};

Template.games.status = function(game) {
  var text, classname;
  var players = game.players;
  var userId = Meteor.userId();
  if (players.length > 1) {
    // Opponent already joined. Game is in progress.
    text = 'In progress';
    classname = 'label-danger';
  } else if (players[0] === userId) {
    text = 'Waiting for opponent...';
    classname = 'label-warning';
  } else {
    text = 'Click to join!';
    classname = 'label-success';
  }

  return '<span class="label ' + classname + '">' + text + '</span>';
};

Template.games.events({
  'click #create-game button[type="submit"]': function(event, template) {
    var checked = template.find('input:checked[name="deckname"]');
    var deck = Decks.findOne({ name: checked.value });
    Meteor.call('saveGame', { deck: deck });
  },

  'click #games td[name="status"] > span.label-success': function(event) {
    // Fetch the table row from the label.
    var row = event.target.parentNode.parentNode;
    var game = UI.getElementData(row);
    Session.set('games.joining', game);  // Persist the game we're joining.
    $('#choose-deck-dialog').modal();
  },

  'click #games td[name="status"] > span.label-danger': function(event) {
    var row = event.target.parentNode.parentNode;
    var game = UI.getElementData(row);
    Router.go('Games#show', { id: game._id });
  },

  'click #choose-deck .close': function() {
    // The user didn't join, so reset the game we're joining.
    Session.set('games.joining', undefined);
  },

  'click #choose-deck button[type="submit"]': function(event, template) {
    // Wait for the choose deck dialog to go away.
    $('#choose-deck-dialog').on('hidden.bs.modal', function() {
      // Fetch the game we're joining.
      var game = Session.get('games.joining');
      Session.set('games.joining', undefined);

      // Grab our user id and the deck we've selected.
      var userId = Meteor.userId();
      var checked = template.find('input:checked[name="deckname"]');
      var deck = Decks.findOne({ name: checked.value });

      game.players.push(userId);
      game.playerToDeck[userId] = deck;
      Meteor.call('saveGame', game, function() {
        Router.go('Games#show', { id: game._id });
      });
    });
  }
});
