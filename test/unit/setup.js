(function(global) {
  mocha.setup('bdd');
  global.assert = chai.assert;

  function loadScript(src) {
    var deferred = Q.defer();
    var script = document.createElement('script');
    script.src = src;
    script.onload = deferred.resolve;
    script.onerror = deferred.reject;
    document.body.appendChild(script);
    return deferred.promise;
  }
  global.loadScript = loadScript;

  function loadScripts(srcs) {
    return Q.all(srcs.map(loadScript));
  }
  global.loadScripts = loadScripts;

  afterEach(function(done) {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf('PhantomJS') === -1) {
      // Only post coverage information when run via
      // grunt-mocha / PhantomJS.
      return done();
    }

    var req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:8080/coverage/client', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function() {
      if (req.readyState !== 4 || req.status !== 200) {
        return;
      }

      done();
    };

    req.send(JSON.stringify(window.__coverage__));
  });
})(window);
