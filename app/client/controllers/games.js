Template.games.decks = function() {
  return Decks.find().fetch();
};

Template.games.games = function() {
  return Games.find().fetch();
};

Template.games.host = function(game) {
  var playerIds = game.players;
  var playerId = playerIds[0];
  if (!playerId) {
    return 'Guest';
  }

  var player = Meteor.users.find({ _id: playerId }).fetch()[0];
  return player.profile.name;
};

Template.games.opponent = function(game) {
  var players = game.players;
  if (players.length === 1) {
    return '';
  }

  var playerIds = game.players;
  var playerId = playerIds[1];
  if (!playerId) {
    return 'Guest';
  }

  var player = Meteor.users.find({ _id: playerId }).fetch()[0];
  return player.profile.name;
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

  'click #games td[name="status"] > span.label-success': function() {
    // Join game!
    var userId = Meteor.userId();
    this.players.push(userId);
    // TODO(gareth): We have to get a deck from them.
    Meteor.call('saveGame', this);
  }
});
