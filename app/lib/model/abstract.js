/* global Model: true */
Model = function Model(options) {
  for (var key in options) {
    this[key] = options[key];
  }
};

Model.prototype = {
  clone: function() {
    throw new Error('Model#clone must be overridden');
  },

  equals: function(other) {
    return this._id === other._id;
  },

  toJSONValue: function() {
    throw new Error('Model#toJSONValue must be overridden');
  },

  toString: function() {
    return JSON.stringify(this.toJSONValue());
  },

  typeName: function() {
    return this.constructor.name;
  }
};
