var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer,
    debug = require('debug')('envoy:bootstrap_test'),
    execf = require('../../tasks/lib/execf'),
    fs = require('fs'),
    http = require('http'),
    rimraf = require('rimraf').sync,
    spawn = require('child_process').spawn,
    webdriver = require('selenium-webdriver');

var ROOT_PATH = __dirname + '/../..';

var SELENIUM_JAR_PATH =
  ROOT_PATH + '/node_modules/selenium-standalone/.selenium/2.40.0/server.jar';

var METEOR_PATH = ROOT_PATH + '/build';

var MONGO_PATH = ROOT_PATH + '/build/.meteor/local/db/';

global.ENVOY_BASE_PATH = 'http://localhost:3000';

var meteor, selenium, driver;

before(function() {
  // Start selenium standalone server.
  selenium = new SeleniumServer(SELENIUM_JAR_PATH, { port: 4444 });
  selenium.start();
});

after(function() {
  // Stop selenium standalone server.
  selenium.stop();
});

beforeEach(function(done) {
  debug('Purge mongo database.');
  rimraf(MONGO_PATH);

  debug('Start meteor.');
  meteor = spawn('meteor', [], { cwd: METEOR_PATH });

  var stdout = [];
  meteor.stdout.on('data', function(chunk) {
    debug('meteor: %s', chunk.toString());

    // Write to buffer.
    stdout.push(chunk);
    var data = Buffer.concat(stdout).toString();

    // If meteor has written this message to stdout, we're good.
    if (data.indexOf('=> Started your app') === -1) {
      return;
    }

    debug('Meteor ready.');
    meteor.stdout.removeAllListeners('data');

    debug('Load fixtures.');
    execf('cd %s && ./node_modules/.bin/grunt fixtures', ROOT_PATH);

    debug('Begin selenium session.');
    driver = new webdriver
      .Builder()
      .usingServer(selenium.address())
      .withCapabilities(webdriver.Capabilities.firefox())
      .build();
    global.driver = driver;
    done();
  });

  // TODO(gareth): For some reason our test suite
  //     times out on circleci if we don't listen to
  //     stderr. Why is that?
  meteor.stderr.on('data', function() {
  });
});

afterEach(function(done) {
  debug('End selenium session.');

  debug('Grab coverage data from browser.');
  driver
    .executeScript('return window.__coverage__;')
    .then(function(coverage) {
      debug('Post coverage data to istanbul server.');
      var options = {
        host: 'localhost',
        port: 8080,
        path: '/coverage/client',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      var req = http.request(options, function(res) {
        driver.quit();

        debug('Stop meteor.');
        meteor.kill();
        meteor.on('exit', function() {
          done();
        });
      });

      req.write(JSON.stringify(coverage));
      req.end();
    });
});
