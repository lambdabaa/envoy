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
test/unit/nodejs/            # <= unit tests for server-side code
test/unit/shared/            # <= unit tests for shared code
```

### Running Locally

To run envoy locally, you must first globally install:

+ firefox
+ java
+ meteor
+ mongodb
+ xvfb

Then...

```
// Install dependencies
npm install
cd app && ../node_modules/.bin/mrt install

// Run meteor
cd app && meteor

// In another terminal session, you can load some fixture data
./node_modules/.bin/grunt fixtures
```

### Tests

To run the lint and test suites:

```
// Install app, test dependencies
npm install
cd app && ../node_modules/.bin/mrt install

// Run lint, unit, and integration tests (in xvfb)
xvfb-run npm test
```
