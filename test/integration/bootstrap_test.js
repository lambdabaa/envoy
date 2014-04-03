var Landing = require('./lib/landing'),
    Login = require('./lib/facebook_login'),
    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer,
    debug = require('debug')('envoy:bootstrap_test'),
    execf = require('../../tasks/lib/execf'),
    http = require('http'),
    rimraf = require('rimraf').sync,
    spawn = require('child_process').spawn,
    webdriver = require('selenium-webdriver');

var ROOT_PATH = __dirname + '/../..';

var SELENIUM_JAR_PATH =
  ROOT_PATH + '/node_modules/selenium-standalone/.selenium/2.40.0/server.jar';

var METEOR_PATH = ROOT_PATH + '/build';

var MONGO_PATH = ROOT_PATH + '/build/.meteor/local/db/';

var meteor, selenium, driver;

before(function(done) {
  debug('Start selenium standalone server.');
  selenium = new SeleniumServer(SELENIUM_JAR_PATH, { port: 4444 });
  selenium.start();

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

    // TODO(gareth): We configure Facebook login here since I'm not sure how
    //     to purge the configuration after each test since it's hidden
    //     behind the accounts-facebook package abstraction. We should
    //     look into whether there's a stable way to reset state though.
    debug('Configure FB login.');
    debug('Begin selenium session.');
    driver = new webdriver
      .Builder()
      .usingServer(selenium.address())
      .withCapabilities(webdriver.Capabilities.firefox())
      .build();
    global.driver = driver;

    var timeouts = new webdriver.WebDriver.Timeouts(driver);
    timeouts
      .setScriptTimeout(20000)
      .then(function() {
        var landing = new Landing();
        return landing.launch();
      })
      .then(function() {
        var login = new Login();
        return login.configure();
      })
      .then(function() {
        return driver.quit();
      })
      .then(function() {
        done();
      });
  });

  // TODO(gareth): For some reason our test suite
  //     times out on circleci if we don't listen to
  //     stderr. Why is that?
  meteor.stderr.on('data', function() {
  });
});

after(function(done) {
  debug('Stop selenium standalone server.');
  selenium.stop();

  debug('Stop meteor server.');
  meteor.on('exit', function() {
    done();
  });
  meteor.kill();
});

beforeEach(function() {
  debug('Load fixtures.');
  execf('cd %s && ./node_modules/.bin/grunt fixtures', ROOT_PATH);

  debug('Begin selenium session.');
  driver = new webdriver
    .Builder()
    .usingServer(selenium.address())
    .withCapabilities(webdriver.Capabilities.firefox())
    .build();
  global.driver = driver;

  var timeouts = new webdriver.WebDriver.Timeouts(driver);
  return timeouts.setScriptTimeout(20000);
});

afterEach(function() {
  debug('Grab coverage data from browser.');
  return driver
    .executeScript(function() {
      return window.__coverage__;
    })
    .then(function(data) {
      return postCoverageData(data);
    })
    .then(function() {
      var landing = new Landing();
      return landing.launch();
    })
    .then(function() {
      debug('Reset collections.');
      return driver.executeAsyncScript(function() {
        var callback = arguments[arguments.length - 1];
        Meteor.call('removeAll', function() {
          callback();
        });
      });
    })
    .then(function() {
      return driver.quit();
    });
});

// TODO(gareth): Ideally, we would wait for the request to finish before
//     continuing to avoid race conditions. Interestingly, the POST
//     request hangs, so we're not blocking on it at the moment, but
//     it's possible that we could lose coverage data. Look into
//     whether the slowdown is due to an issue in istanbul.
function postCoverageData(data) {
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

  var req = http.request(options);
  req.write(JSON.stringify(data));
  req.end();
}
