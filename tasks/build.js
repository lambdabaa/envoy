var execf = require('./lib/execf'),
    fs = require('fs');

module.exports = function(grunt) {
  grunt.registerMultiTask('build', function() {
    // 1. Copy the source tree into a temporary, build directory.
    var appdir = __dirname + '/../app/';
    var builddir = __dirname + '/../' + this.data.dir;
    execf('cp -r %s %s', appdir, builddir);

    // Third party code.
    var modulesdir = __dirname + '/../node_modules/';
    var thirdpartydir = builddir + 'client/third_party/';
    fs.mkdirSync(thirdpartydir);
    execf('cp %s/node-uuid/uuid.js %s', modulesdir, thirdpartydir);

    // 2. Run |mrt install|.
    execf('cd %s && ../node_modules/.bin/mrt install', builddir);
  });

  // Do an "incremental build" when a file in app changes.
  // This is lighter weight than a full "build".
  grunt.registerTask('incremental', function() {
    var appdir = __dirname + '/../app/';
    var builddir = __dirname + '/../build/';

    [
      'client',
      'lib',
      'server'
    ].forEach(function(dir) {
      execf('cp -r %s %s', appdir + dir, builddir);
    });
  });
};
