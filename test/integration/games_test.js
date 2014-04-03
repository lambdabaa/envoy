var DeckBuilder = require('./lib/deckbuilder'),
    Games = require('./lib/games'),
    test = require('selenium-webdriver/testing');

test.describe('games', function() {
  var games;

  test.beforeEach(function() {
    // Create a deck.
    var deckbuilder = new DeckBuilder();
    deckbuilder
      .launch()
      .then(function() {
        return deckbuilder.createDeck('mouserat');
      });

    games = new Games();
    games.launch();
  });

  test.it('list should initially be empty', function() {
    games
      .getAll()
      .then(function(list) {
        assert.lengthOf(list, 0);
      });
  });
});
