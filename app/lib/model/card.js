/* global Card: true */
/* global Model */
Card = function Card() {
  Model.apply(this, arguments);
};

EJSON.addType('Card', function(value) {
  return new Card(value);
});

Card.prototype = {
  __proto__: Model.prototype,

  constructor: Card,

  /**
   * @type {String}
   */
  name: null,

  /**
   * @type {String}
   */
  color: null,

  /**
   * @type {String}
   */
  image: null,

  /**
   * @type {Object}
   */
  cost: null,

  /**
   * @type {Object}
   */
  cardtype: null,

  /**
   * @type {Number}
   */
  power: null,

  /**
   * @type {Number}
   */
  hp: null,

  formatCardtype: function() {
    if (!'secondary' in this.cardtype) {
      return this.cardtype.primary;
    }

    return this.cardtype.primary + ' - ' + this.cardtype.secondary;
  },

  formatCombat: function() {
    var power = _.isNumber(this.power) ? this.power : '?';
    var hp = _.isNumber(this.hp) ? this.hp : '?';
    return power + ' / ' + hp;
  },

  formatDescription: function() {
    return this.description.join(' ');
  },

  isNotEnvoy: function() {
    return this.cardtype.primary !== 'Envoy';
  },

  zeroColorCost: function() {
    return !this.cost.color;
  },

  zeroColorlessCost: function() {
    return !this.cost.colorless;
  },

  clone: function() {
    return new Card(this.toJSONValue());
  },

  toJSONValue: function() {
    var result = {};
    [
      'name',
      'color',
      'image',
      'cost',
      'cardtype',
      'power',
      'hp'
    ].forEach(function(key) {
      result[key] = this[key];
    }, this);

    return result;
  }
};
