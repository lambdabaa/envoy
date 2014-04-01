/**
 * @fileoverview Seed mongodb with data from json files.
 */
var debug = require('debug')('envoy:fixtures'),
    exec = require('exec-sync'),
    execf = require('./lib/execf'),
    format = require('util').format,
    fs = require('fs'),
    glob = require('glob'),
    url = require('url');

module.exports = function(grunt) {
  grunt.registerTask('fixtures', function() {
    // Find mongo url.
    var mongoUrl = execf('cd %s && meteor mongo -U', __dirname + '/../build');
    mongoUrl = url.parse(mongoUrl.replace(/\s+/, ''));
    debug('Read mongo url %s', JSON.stringify(mongoUrl));
    var db = mongoUrl.path.substring(1);

    // Read list of collections in fixtures.
    var collections = fs.readdirSync(__dirname + '/../fixtures');
    debug('Loading collections: %s', collections.join(', '));
    collections.forEach(function(collection) {
      debug('Next collection: %s', collection);

      // Read all JSON files from top level collection directory.
      var pattern = format(
        '%s/../fixtures/%s/**/*.json',
        __dirname,
        collection
      );
      var files = glob.sync(pattern);
      files.forEach(function(file) {
        debug('%s > %s', file, collection);
        // Import into mongo.
        var mongoimport = format(
          'mongoimport -h %s -d %s -c %s --file %s --jsonArray',
          mongoUrl.host,
          db,
          collection,
          file
        );

        exec(mongoimport);
      });

      debug('Imported %d objects from %s', files.length, collection);
    });

    debug('done');
  });
};
