var FacebookLogin = require('./lib/facebook_login'),
    Landing = require('./lib/landing'),
    test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver');

test.describe('login', function() {
  var login;

  test.beforeEach(function() {
    var landing = new Landing();
    landing.launch();
    login = new FacebookLogin();
  });

  test.it('should not be configured', function() {
    login
      .isConfigured()
      .then(function(configured) {
        assert.notOk(configured);
      });
  });

  test.it('should be configurable', function() {
    login
      .configure()
      .then(function() {
        login
          .isConfigured()
          .then(function(configured) {
            assert.ok(configured);
          });
      });
  });

  test.it('should allow facebook login', function() {
    login
      .configure()
      .then(function() {
        return login.authorize(DONNA);
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css('#login-name-link'))
          .getText();
      })
      .then(function(text) {
        assert.include(text, DONNA.name);
      });
  });
});
