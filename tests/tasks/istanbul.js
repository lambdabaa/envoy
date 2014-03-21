var _ = require('underscore'),
    exec = require('child_process').exec,
    format = require('util').format,
    glob = require('glob'),
    path = require('path');

module.exports = function(grunt) {
  grunt.registerMultiTask('istanbul', 'Generate coverage report', function() {
    var done = this.async();

    var dir = path.resolve(__dirname, '../..'),
        istanbul = path.resolve(__dirname, '../node_modules/.bin/istanbul'),
        mocha = path.resolve(__dirname, '../node_modules/.bin/_mocha'),
        setup = path.resolve(__dirname, '../setup.js');

    var files = _
      .flatten(this.data.paths.map(function(file) {
        return glob.sync(file);
      }))
      .map(function(file) {
        return path.join(__dirname, '..', file);
      });

    var cover = format('%s cover %s -- --require %s %s',
      istanbul, mocha, setup, files.join(' '));
    exec(cover, { cwd: dir }, function(err, stdout) {
      console.log(stdout);

      var report = format('%s report', istanbul);
      exec(report, function() {
        // TODO(gareth): Why are there two coverage directories created?
        var badCopy = path.join(__dirname, '../coverage');
        var goodCopy = path.join(__dirname, '../../coverage');
        var replace = format(
          'rm -rf %s && mv %s %s', badCopy, goodCopy, badCopy);
        exec(replace, { cwd: dir }, function() {
          done();
        });
      });
    });
  });
};
