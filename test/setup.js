/**
 * @fileoverview Global test setup for nodejs unit tests.
 */
var _ = require('underscore'),
    assert = require('chai').assert,
    glob = require('glob'),
    path = require('path');

global._ = _;

// TODO(gareth): ...
global.Meteor = {
  Collection: function() {
    return {
      allow: function() {}
    };
  },

  methods: function() {},

  publish: function() {},

  startup: function() {}
};

global.Npm = {
  require: function() {}
};

global.assert = assert;

// We're going to find all of the modules which will be available to our
// meteor server environment and require them.
_.flatten([
  glob.sync(path.resolve(__dirname, '../app/lib/**/*.js')),
  glob.sync(path.resolve(__dirname, '../app/server/**/*.js'))
]).forEach(require);
