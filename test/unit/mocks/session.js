/* jshint -W098 */
var Session = {
  get: function(key) {
    return dumbSession[key];
  },

  set: function(key, value) {
    dumbSession[key] = value;
  }
};

var dumbSession = {};
