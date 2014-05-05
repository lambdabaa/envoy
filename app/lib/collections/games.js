/* global Games: true */
/* global uuid */

/**
 * (Array) players list of game players.
 * (Object) idToCard map from game card id to card.
 * (Object) playerToDeck map from player id to deck.
 * (Object) playerToEnergy map from player to energy stored.
 * (Object) playerToEnergyAvailable map from player to energy current turn.
 * (Object) playerToHand map from player id to cards in hand.
 * (Object) playerToGraveyard map from player id to cards in graveyard.
 * (Object) playerToLibrary map from player id to cards in library.
 * (Object) playerToLife map from player id to life total.
 * (Boolean) started whether or not game has started.
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

Games.getOpponent = function(game) {
  var userId = Meteor.userId();
  return _.find(game.players, function(playerId) {
    return playerId !== userId;
  });
};

/**
 * 1. Setup libraries, graveyards, and hands.
 * 2. Set life totals to 20 each.
 * 3. Decide who will go first.
 * 4. Mark game "started".
 */
Games.startGame = function(game) {
  var players = game.players;
  var playerToDeck = game.playerToDeck;

  // Setup libraries, graveyards, energies and hands.
  game.playerToEnergy = {};
  game.playerToEnergyAvailable = {};
  game.playerToField = {};
  game.playerToHand = {};
  game.playerToGraveyard = {};
  game.playerToLibrary = {};
  game.idToCard = {};
  var emptyEnergy = { blue: 0, green: 0, purple: 0, red: 0, white: 0 };
  players.forEach(function(playerId) {
    game.playerToEnergy[playerId] = EJSON.clone(emptyEnergy);
    game.playerToEnergyAvailable[playerId] = EJSON.clone(emptyEnergy);
    game.playerToField[playerId] = [];
    game.playerToHand[playerId] = [];
    var deck = playerToDeck[playerId];
    var library = setupLibrary(deck);
    game.playerToLibrary[playerId] = library;
    game.playerToGraveyard[playerId] = [];
    library.forEach(function(card) {
      game.idToCard[card.id] = card;
    });
  });

  // Set life totals.
  game.playerToLife = {};
  players.forEach(function(player) {
    game.playerToLife[player] = 20;
  });

  // Decide who will go first.
  var toss = Math.random();
  game.currentPlayer = (toss < 0.5) ? players[0] : players[1];

  // Mark started.
  game.started = true;
  return game;
};


/**
 * Take a deck that looks like
 *
 * {
 *   name: 'dogs',
 *   list: [
 *     { card: { name: 'Linus', ... }, count: 4 },
 *     { card: { name: 'Samson' ... }, count: 2 }
 *   ]
 * }
 *
 * turn it into something like
 *
 * [
 *   { card: { id: x, name: 'Linus', ... } },
 *   { card: { id: y, name: 'Linus' } },
 *   ...
 *   { card: { id: z, name: 'Samson', ... } },
 *   ...
 * ]
 *
 * and then shuffle it.
 */
function setupLibrary(deck) {
  return _.shuffle(
    _.flatten(
      deck.list.map(function(record) {
        return _.times(record.count, function() {
          var card = EJSON.clone(record.card);
          card.id = uuid.v4();
          return card;
        });
      }), true /* shallow */
    )
  );
}
