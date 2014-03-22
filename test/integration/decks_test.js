var Deck = require('./lib/deck'),
    DeckBuilder = require('./lib/deckbuilder'),
    Decks = require('./lib/decks'),
    Q = require('q'),
    test = require('selenium-webdriver/testing');

test.describe('decks', function() {
  var deckbuilder, decks;

  test.before(function() {
    deckbuilder = new DeckBuilder();
    decks = new Decks();
  });

  test.beforeEach(function() {
    decks.launch();
  });

  test.it('list should be initially empty', function() {
    decks
      .getAll()
      .then(function(list) {
        assert.lengthOf(list, 0);
      });
  });

  test.it('should list deck after deck save', function() {
    deckbuilder
      .launch()
      .then(function() {
        return deckbuilder.cardpool();
      })
      .then(function(cards) {
        var clickPurple =
          _.find(cards, function(card) {
            return card.color === 'purple';
          })
          .click();
        var clickWhite =
          _.find(cards, function(card) {
            return card.color === 'white';
          })
          .click();
        return Q.all([clickPurple, clickWhite]);
      })
      .then(function() {
        return deckbuilder.setName('Four on Six');
      })
      .then(function() {
        return decks.launch();
      })
      .then(function() {
        return decks
          .getAll()
          .then(function(list) {
            assert.lengthOf(list, 1);
            var deck = list[0];
            assert.instanceOf(deck, Deck);
            assert.strictEqual(deck.name, 'Four on Six');
            assert.strictEqual(deck.cards, 2);
            assert.isArray(deck.colors);
            assert.include(deck.colors, 'purple');
            assert.include(deck.colors, 'white');
            assert.lengthOf(deck.colors, 2);
          });
      });
  });
});
