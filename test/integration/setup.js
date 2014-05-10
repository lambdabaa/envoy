var _ = require('underscore'),
    assert = require('chai').assert;

global._ = _;
global.assert = assert;

global.APP_ID = '641806779225581';
global.APP_SECRET = '8c12107ae123b8f8d1188e87fcb95a17';
global.ENVOY_BASE_PATH = 'http://localhost:4000';

/* Test facebook graph users */
global.TOM = {
  name: 'Tom Amhjhgefaega Carrieroson',
  userId: '100008087561571',
  email: 'falcfsh_carrieroson_1396751148@tfbnw.net',
  pass: 'ye0man'
};

global.JOE = {
  name: 'Joe Amhajfacaeaj Panditescu',
  userId: '100008106131510',
  email: 'rnfzqak_panditescu_1396751147@tfbnw.net',
  pass: 'ye0man'
};

global.DONNA = {
  name: 'Donna Amhaajegacic Ricewitz',
  userId: '100008110571393',
  email: 'mejrzrs_ricewitz_1396751450@tfbnw.net',
  pass: 'ye0man'
};
