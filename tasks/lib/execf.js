var debug = require('debug')('envoy:execf'),
    exec = require('exec-sync'),
    format = require('util').format;

module.exports = function() {
  var command = format.apply(this, Array.prototype.slice.call(arguments));
  debug(command);
  // TODO(gareth): When we DEBUG exec throws an error for some reason?
  var result;
  try {
    result = exec(command);
  } catch (err) {
    console.error(err.toString());
  }

  return result;
};
