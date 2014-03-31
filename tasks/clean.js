var execf = require('./lib/execf');

module.exports = function(grunt) {
  grunt.registerTask('clean', function() {
    [
      '*.tar.gz',
      '*.zip',
      'build/',
      'coverage/',
      'coverage-browser/'
    ].forEach(function(path) {
      execf('rm -rf %s/%s', __dirname + '/..', path);
    });
  });
};
