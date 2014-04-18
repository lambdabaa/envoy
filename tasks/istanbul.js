var _ = require('underscore'),
    exec = require('exec-sync'),
    execf = require('./lib/execf'),
    format = require('util').format,
    glob = require('glob'),
    spawn = require('child_process').spawn;

var ISTANBUL_PATH = __dirname + '/../node_modules/.bin/istanbul';

module.exports = function(grunt) {
  grunt.registerMultiTask('istanbul', function() {
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
        execf(
          '%s instrument %s --output %s --embed-source true --compact false',
          ISTANBUL_PATH,
          file,
          instrumented
        );
        execf('mv %s %s', file, temp);
      });
    };

    /**
     * Start express server with istanbul connect middleware.
     */
    this.startServer = function() {
      var server = spawn('node', ['istanbul_server.js'], {
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
      execf(
        'wget --quiet -O %s %s',
        'coverage.zip',
        'http://localhost:8080/coverage/download'
      );
      execf('fuser -s -n tcp -k %d', 8080);
      var dir = __dirname + '/../coverage';
      execf('mkdir %s', dir);
      execf('unzip coverage.zip -d %s', dir);
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
