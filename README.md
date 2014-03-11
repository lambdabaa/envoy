envoy
=====

Envoy is a multiplayer trading card game built with [meteor](https://meteor.com).

### Directory Structure

```
.meteor/                     # <= configure meteor version, packages

client/                      # <= bundled into client
client/style/                # <= css made available to clients
client/views/                # <= client-side template and controller code

lib/                         # <= shared between browser and server
lib/collections/             # <= meteor models

server/                      # <= bundled into server

tests/                       # <= where tests live
tests/integration/           # <= integration test cases
tests/unit/                  # <= unit test cases
tests/unit/client/           # <= unit tests for client code
tests/unit/lib/              # <= unit tests for shared code
tests/unit/server/           # <= unit tests for server code
```

### Tests

To run the lint and test suites, install:

+ firefox
+ java
+ meteor
+ xvfb

and then do the following:

```
// Run meteor (on port 3000) in one terminal session
meteor

// Run the tests in another
cd tests

// Install testing dependencies
npm install

// Run lint, unit, and integration tests (in xvfb)
xvfb-run ./node_modules/.bin/grunt
```

In order to run the tests continuously as you develop (in xvfb), you can do

```
cd tests
xvfb-run ./node_modules/.bin/grunt watch
```
