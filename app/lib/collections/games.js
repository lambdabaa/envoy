/* global Games: true */
/* global Game */
Games = new Meteor.Collection('games', {
  transform: function(doc) {
    return new Game(doc);
  }
});

Meteor.methods({
  /**
   * Options:
   *   (Deck) deck for game creator.
   */
  saveGame: function(options) {
    if (options instanceof Game) {
      return Games.update({ _id: options._id }, options.toJSONValue());
    }

    var userId = Meteor.userId();
    var game = {};
    game.players = [userId];
    game.playerToDeck = {};
    game.playerToDeck[userId] = options.deck;
    return Games.insert(game);
  }
});
