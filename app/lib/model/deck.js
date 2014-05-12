/* global Deck: true */
/* global Model */
Deck = function Deck() {
  Model.apply(this, arguments);
};

EJSON.addType('Deck', function(value) {
  return new Deck(value);
});

Deck.prototype = {
  __proto__: Model.prototype,

  constructor: Deck,

  /**
   * @type {String}
   */
  creator: null,

  /**
   * @type {String}
   */
  name: null,

  /**
   * @type {Array}
   */
  list: null,

  clone: function() {
    return new Deck(this.toJSONValue());
  },

  toJSONValue: function() {
    var result = {};
    [
      'creator',
      'name',
      'list'
    ].forEach(function(key) {
      result[key] = this[key];
    }, this);

    return result;
  }
};
