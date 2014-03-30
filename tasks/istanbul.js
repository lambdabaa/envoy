var _ = require('underscore'),
    exec = require('exec-sync'),
    format = require('util').format,
    glob = require('glob'),
    spawn = require('child_process').spawn;

var ISTANBUL_PATH = __dirname + '/../node_modules/.bin/istanbul';
var MOCHA_PATH = __dirname + '/../node_modules/.bin/_mocha';
var MOCHA_SETUP_PATH = __dirname + '/../test/setup.js';

module.exports = function(grunt) {
  grunt.registerMultiTask('istanbul', function() {
    /**
     * Run mocha tests with code coverage.
     */
    this.mocha = function() {
      var done = this.async();
      var cover = spawn(ISTANBUL_PATH, [
        'cover',
        MOCHA_PATH,
        '--',
        '--reporter', 'spec',
        '--require', MOCHA_SETUP_PATH
      ].concat(this._files()));

      cover.stdout.pipe(process.stdout);
      cover.on('exit', function() {
        done();
      });
    };

    /**
     * Instrument code on the given paths.
     */
    this.instrument = function() {
      this._files().forEach(function(file) {
        // Important that this doesn't end in .js since we don't
        // want for meteor to load both the instrumented code
        // and non-instrumented code when we run tests.
        var temp = file.replace('.js', '.js.txt');
        var instrumented = file.replace('.js', '.cover.js');
        exec(format(
          '%s instrument %s --output %s --embed-source true --compact false',
          ISTANBUL_PATH,
          file,
          instrumented
        ));
        exec(format('mv %s %s', file, temp));
      });
    };

    /**
     * Delete instrumented code and restore original.
     */
    this.restore = function() {
      this._files().forEach(function(file) {
        var original = file.replace('.js.txt', '.js');
        var instrumented = file.replace('.js.txt', '.cover.js');
        exec(format('rm %s', instrumented));
        exec(format('mv %s %s', file, original)); 
      });  
    };

    /**
     * Start express server with istanbul connect middleware.
     */
    this.startServer = function() {
      var server = spawn('./istanbul_server.js', [], {
        cwd: __dirname + '/lib',
        detached: true,
        stdio: 'ignore'
      });

      // Run in background.
      server.unref();

      // Wait for server to come up.
      exec('while ! nc -z localhost 8080; do sleep 1; done');
    };

    /**
     * Download coverage data from istanbul express server and kill server.
     */
    this.stopServer = function() {
      exec(format(
        'wget --quiet -O %s %s',
        'coverage.zip',
        'http://localhost:8080/coverage/download'
      ));
      exec(format('fuser -s -n tcp -k %d', 8080));
      var dir = __dirname + '/../coverage-browser';
      exec(format('mkdir %s', dir));
      exec(format('unzip coverage.zip -d %s', dir));
    };

    this._files = function() {
      return _
        .flatten(this.data.paths.map(function(pattern) {
          return glob.sync(pattern);
        }))
        .map(function(file) {
          return format('%s/../%s', __dirname, file);
        });
    };

    this[this.target].call(this);
  });
};
