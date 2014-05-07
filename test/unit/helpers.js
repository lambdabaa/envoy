(function(global) {
  global.wait = function wait(predicate, callback) {
    if (predicate()) {
      return callback();
    }

    var next = wait.bind(null, predicate, callback);
    return setTimeout(next, 100);
  };
})(window);
