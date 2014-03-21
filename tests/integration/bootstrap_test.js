var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer,
    webdriver = require('selenium-webdriver');

var SELENIUM_JAR_PATH = __dirname +
  '/../node_modules/selenium-standalone/.selenium/2.40.0/server.jar';

var server, driver;

global.ENVOY_BASE_PATH = 'http://localhost:3000';

before(function() {
  server = new SeleniumServer(SELENIUM_JAR_PATH, { port: 4444 });
  server.start();
  global.server = server;
});

after(function() {
  server.stop();
});

beforeEach(function() {
  driver = new webdriver
    .Builder()
    .usingServer(server.address())
    .withCapabilities(webdriver.Capabilities.firefox())
    .build();
  global.driver = driver;
});

afterEach(function() {
  driver.quit();
});
