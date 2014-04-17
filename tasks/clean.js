var execf = require('./lib/execf');

module.exports = function(grunt) {
  grunt.registerMultiTask('clean', function() {
    var builddir = this.data.dir;

    [
      '*.tar.gz',
      '*.zip',
      builddir,
      'coverage/',
      'coverage-browser/'
    ].forEach(function(path) {
      execf('rm -rf %s/%s', __dirname + '/..', path);
    });
  });
};
