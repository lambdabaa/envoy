var execf = require('./lib/execf');

module.exports = function(grunt) {
  grunt.registerTask('build', function() {
    // 1. Copy the source tree into a temporary, build directory.
    execf('cp -r %s %s', __dirname + '/../app/', __dirname + '/../build/');
    // 2. Run |mrt install|.
    execf(
      'cd %s && ../node_modules/.bin/mrt install',
      __dirname + '/../build/'
    );
    // TODO(gareth): Bundle the meteor app and push the app tarball to
    //     a docker container.
  });

  // Do an "incremental build" when a file in app changes.
  // This is lighter weight than a full "build".
  grunt.registerTask('incremental', function() {
    [
      'client',
      'lib',
      'server'
    ].forEach(function(dir) {
      execf(
        'cp -r %s %s',
        __dirname + '/../app/' + dir,
        __dirname + '/../build/'
      );
    });
  });
};
