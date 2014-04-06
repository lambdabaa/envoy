var FacebookLogin = require('./lib/facebook_login'),
    Landing = require('./lib/landing'),
    debug = require('debug')('envoy:login_test'),
    webdriver = require('selenium-webdriver');

describe('login', function() {
  var login;

  beforeEach(function() {
    var landing = new Landing();
    login = new FacebookLogin();
    return landing.launch();
  });

  it('should be configured', function() {
    return login
      .isConfigured()
      .then(function(configured) {
        assert.ok(configured);
      });
  });

  it('should allow facebook login', function() {
    return login
      .authorize(DONNA)
      .then(function() {
        debug('Check login name.');
        return driver
          .findElement(webdriver.By.css('#login-name-link'))
          .getText();
      })
      .then(function(text) {
        assert.include(text, DONNA.name);
      });
  });
});
