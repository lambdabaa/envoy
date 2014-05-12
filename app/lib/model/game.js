/* global Game: true */
/* global Model, uuid */
Game = function Game() {
  Model.apply(this, arguments);
};

EJSON.addType('Game', function(value) {
  if ('players' in value) {
    value.players = Array.prototype.slice.call(value.players);
  }

  return new Game(value);
});

Game.prototype = {
  __proto__: Model.prototype,

  constructor: Game,

  /**
   * @type {Object}
   */
  cards: null,

  /**
   * @type {Object}
   */
  playerToDeck: null,

  /**
   * @type {Object}
   */
  playerToEnergy: null,

  /**
   * @type {Object}
   */
  playerToEnergyAvailable: null,

  /**
   * @type {Object}
   */
  playerToField: null,

  /**
   * @type {Object}
   */
  playerToGraveyard: null,

  /**
   * @type {Object}
   */
  playerToHand: null,

  /**
   * @type {Object}
   */
  playerToLibrary: null,

  /**
   * @type {Object}
   */
  playerToLife: null,

  /**
   * @type {Array}
   */
  players: null,

  /**
   * @type {Boolean}
   */
  started: null,

  getOpponent: function() {
    var userId = Meteor.userId();
    return _.find(this.players, function(playerId) {
      return playerId !== userId;
    });
  },

  start: function() {
    this.cards = {};
    this.playerToEnergy = {};
    this.playerToEnergyAvailable = {};
    this.playerToField = {};
    this.playerToGraveyard = {};
    this.playerToHand = {};
    this.playerToLibrary = {};
    this.playerToLife = {};

    var energy = { blue: 0, green: 0, purple: 0, red: 0, white: 0 };
    this.players.forEach(function(playerId) {
      this.playerToEnergy[playerId] = EJSON.clone(energy);
      this.playerToEnergyAvailable[playerId] = EJSON.clone(energy);
      this.playerToField[playerId] = [];
      this.playerToGraveyard[playerId] = [];
      this.playerToHand[playerId] = [];
      this.playerToLife[playerId] = 20;

      var deck = this.playerToDeck[playerId];
      var library = setupLibrary(deck);
      this.playerToLibrary[playerId] = library;
      library.forEach(function(card) {
        this.cards[card.id] = card;
      }, this);
    }, this);

    this.started = true;
  },

  clone: function() {
    return new Game(this.toJSONValue());
  },

  toJSONValue: function() {
    var result = {};
    [
      'cards',
      'playerToDeck',
      'playerToEnergyAvailable',
      'playerToField',
      'playerToGraveyard',
      'playerToHand',
      'playerToLibrary',
      'playerToLife',
      'players',
      'started'
    ].forEach(function(key) {
      result[key] = EJSON.clone(this[key]);
    }, this);

    // Don't add _id if it's not already there.
    if ('_id' in this) {
      result._id = this._id;
    }

    return result;
  }
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
      })
    )
  );
}
