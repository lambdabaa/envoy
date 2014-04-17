envoy
=====

[![Build Status](https://circleci.com/gh/gaye/envoy.png?circle-token=e2943dcf3107f6e6f6396a052f79c7c1aba87299)](https://circleci.com/gh/gaye/envoy?circle-token=e2943dcf3107f6e6f6396a052f79c7c1aba87299)

### Overview

Envoy is a multiplayer trading card game built with [meteor](https://meteor.com). It is intended to be (conceptually) similar to other trading card games like magic, yugioh and pokemon. Here are some of the project's high-level goals which (perhaps) differentiate it from other games.

1. Envoy is asynchronous by default. While your opponent is taking a turn, you can feed farm animals, build a pillow fort, etc.
2. Envoy is a modern, networked computer game. Most other, historic card games made design decisions that allowed humans to compute and store the game state. Nowadays, everyone and their mother has insanely powerful, general-purpose computers which opens up game options.
3. Envoy is an open platform. We will strive to make it so that other developers can build "apps" on top of our data ranging from alternate game players to marketplaces.
4. Many card games are optimized to make a lot of money off of folks with gambling problems. If Envoy ever has a commercial offering, we will make choices that align Envoy's profits with players' joy, well-being, and thought. Envoy's primary goal is to engage and entertain people in wonderful ways.

### The Game

+ Four kinds of cards: envoy, spell, device, and trap.
+ Envoys attack and defend.
+ Spells affect the game immediately when they are played.
+ Devices stay in play and have a continuous effect on the game.
+ Traps are played face down and the game engine triggers them when the game state meets certain conditions.
+ Players alternate taking turns.
+ A turn consists of
  + declaring defenders if the player is under attack,
  + resolving the combat,
  + "refreshing" envoys and devices,
  + drawing a card,
  + optionally casting one card to energy,
  + optionally playing any cards in hand and invoking "invokeable" abilities,
  + optionally attacking with any envoys in play that were played before this turn or have the "speedy" ability

### Directory Structure

```
app/                         # <= where the main meteor app lives
app/.meteor/                 # <= configure meteor version, packages

app/client/                  # <= bundled into client
app/client/controllers/      # <= template data && controller code
app/client/style/            # <= css made available to clients
app/client/templates/        # <= handlebars templates

app/lib/                     # <= shared between browser and server
app/lib/collections/         # <= meteor models

app/server/                  # <= bundled into server

fixtures/                    # <= json files that we mongoimport on start

tasks/                       # <= custom grunt tasks

test/                        # <= where tests live
test/integration/            # <= integration test cases
test/unit/                   # <= unit test cases
test/unit/browser/           # <= unit tests for client-side code
test/unit/mocks/             # <= unit test mocks
test/unit/shared/            # <= unit tests for shared code
```

### Running Locally

To run envoy locally, you must first globally install:

+ meteor
+ mongodb

Additionally, in order to run the full test suite, you need:

+ firefox
+ java
+ xvfb

Then...

```
npm install

// Copy app into build/ directory
./node_modules/.bin/grunt build:default

// Run meteor
cd build && meteor

// In another terminal session, you can load some fixture data
./node_modules/.bin/grunt fixtures:default
```

This will start meteor on port 3000. Open up the app in your browser by navigating to `http://localhost:3000`.

### Development Tips

+ In order to enable Facebook login, click the "Sign In" link on the top right hand corner and enter our fake app id `641806779225581` and secret `8c12107ae123b8f8d1188e87fcb95a17` in the configuration popup.
+ You can enable live updates to your meteor server as you make changes to the app by running `./node_modules/.bin/grunt watch` in another terminal session.
+ If you would like to test interactions with multiple facebook users, we have some test users configured in `test/setup.js`. You can create even more at `https://developers.facebook.com`. Ask Gareth to add you to the test Facebook app.

### Tests

To run the lint and test suites:

```
npm install
./node_modules/.bin/grunt --force
```

### Testing Tips

+ If you abort the test suite before it finishes, you may have left a code coverage server running in the background. You can kill it with `./node_modules/.bin/grunt istanbul:stopServer`.
+ The tests leave some artifacts laying around after they run. Namely, the test's build and code coverage reports remain in `builddir/`, `coverage/`, and `coverage-browser/`. They won't bother anyone, but if you get annoyed you can clean them up with `./node_modules/.bin/grunt clean:test`.
+ If you'd like to view the code coverage reports, you can run the test suite and then start a web server rooted at `coverage/` or `coverage-browser/`. `coverage/` has coverage data for javascript run on node.js whereas `coverage-browser/` has coverage data for javascript run in the browser. Once you've launched your web server, navigate to it in your browser and open `lcov-report/index.html`.
