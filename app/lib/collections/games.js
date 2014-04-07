/**
 * (Array) players list of game players.
 * (Object) playerToDeck map from player id to deck id.
 */
Games = new Meteor.Collection('games');

Meteor.methods({
  /**
   * Options:
   *   (Deck) deck for game creator.
   */
  saveGame: function(options) {
    if (options._id) {
      return Games.update({ _id: options._id }, options);
    }

    var game = {};
    game.players = [this.userId];
    game.playerToDeck = {};
    game.playerToDeck[this.userId] = options.deck;
    Games.insert(game);
  }
});
