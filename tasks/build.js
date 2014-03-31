var execf = require('./lib/execf');

module.exports = function(grunt) {
  grunt.registerTask('build', function() {
    // 1. Copy the source tree into a temporary, build directory.
    execf('cp -r %s %s', __dirname + '/../app/', __dirname + '/../build/');
    // 2. Run |mrt install|.
    execf('cd %s && mrt install', __dirname + '/../build/');
    // TODO(gareth): Bundle the meteor app and push the app tarball to
    //     a docker container.
  });
};
