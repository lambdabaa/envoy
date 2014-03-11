var Card = require('./lib/card'),
    DeckBuilder = require('./lib/deckbuilder'),
    test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver');

var COLORS = ['black', 'blue', 'green', 'red', 'white'];

test.describe('deckbuilder', function() {
  var deckbuilder;

  test.before(function() {
    deckbuilder = new DeckBuilder();
  });

  test.beforeEach(function() {
    deckbuilder.launch();
  });

  test.it('deckname should be initially untitled', function() {
    deckbuilder.getName().then(function(name) {
      assert.equal(name, 'Untitled');
    });
  });

  test.it('deckname should be editable', function() {
    deckbuilder
      .setName('Chicken Fried').then(function() {
        deckbuilder.getName().then(function(name) {
          assert.equal(name, 'Chicken Fried');
        });
      });
  });

  test.it('cardpool should have cards', function() {
    deckbuilder
      .cardpool()
      .then(function(cards) {
        assert.isArray(cards);
        cards.forEach(function(card) {
          assert.instanceOf(card, Card);
          assert.typeOf(card.name, 'string');
          assert.ok(card.name.length > 0, 'should have nonzero length name');
          assert.include(COLORS, card.color);
          assert.typeOf(card.image, 'string');
          assert.typeOf(card.cardtype, 'string');
          assert.typeOf(card.cost, 'object');
          if ('color' in card.cost) {
            assert.typeOf(card.cost.color, 'number');
          }
          if ('colorless' in card.cost) {
            assert.typeOf(card.cost.colorless, 'number');
          }
          assert.typeOf(card.description, 'string');
          if (card.power) {
            assert.typeOf(card.power, 'number');
          }
          if (card.hp) {
            assert.typeOf(card.hp, 'number');
          }
        });
      });
  });

  test.it.skip('cardpool should allow scrolling to see more cards', function() {
    // TODO(gareth)
  });

  test.it('color filters should update cardpool', function() {
    function includeColor(cards, color) {
      return cards.some(function(card) {
        return card.color === color;
      });
    }

    deckbuilder
      .cardpool()
      .then(function(cards) {
        assert.ok(includeColor(cards, 'black'));
      })
      .then(function() {
        return deckbuilder.toggleFilter('color', 'black');
      })
      .then(function() {
        return deckbuilder.cardpool();
      })
      .then(function(cards) {
        assert.notOk(includeColor(cards, 'black'));
      })
      .then(function() {
        return deckbuilder.toggleFilter('color', 'black');
      })
      .then(function() {
        return deckbuilder.cardpool();
      })
      .then(function(cards) {
        assert.ok(includeColor(cards, 'black'));
      });
  });

  test.it('cardtype filters should update cardpool', function() {
    function includeEnvoy(cards) {
      return cards.some(function(card) {
        return card.cardtype.indexOf('Envoy') !== -1;
      });
    }

    deckbuilder
      .cardpool()
      .then(function(cards) {
        assert.ok(includeEnvoy(cards));
      })
      .then(function() {
        return deckbuilder.toggleFilter('cardtype', 'envoy');
      })
      .then(function() {
        return deckbuilder.cardpool();
      })
      .then(function(cards) {
        assert.notOk(includeEnvoy(cards));
      })
      .then(function() {
        return deckbuilder.toggleFilter('cardtype', 'envoy');
      })
      .then(function() {
        return deckbuilder.cardpool();
      })
      .then(function(cards) {
        assert.ok(includeEnvoy(cards));
      });
  });

  test.it('search should update cardpool', function() {
    var expected;
    deckbuilder
      .cardpool()
      .then(function(cards) {
        // Make sure that the cardpool has more than one card.
        assert.ok(cards.length > 1);

        // Grab a card from the cardpool and search for it.
        expected = cards[0];
        return deckbuilder.search(expected.name);
      })
      .then(function() {
        return deckbuilder.cardpool();
      })
      .then(function(cards) {
        // Now only the one card should be in the cardpool.
        assert.equal(cards.length, 1);
        var actual = cards[0];
        assert.deepEqual(actual, expected);
      });
  });

  test.it('deck should be initially empty', function() {
    deckbuilder
      .deck()
      .then(function(entries) {
        assert.isArray(entries);
        assert.equal(entries.length, 0);
      });
  });

  test.it('clicking on a cardpool card should add it to the deck', function() {
    var expected;
    deckbuilder
      .cardpool()
      .then(function(cards) {
        var card = cards[0];
        expected = card.name;
        return card.click();
      })
      .then(function() {
        return deckbuilder.deck();
      })
      .then(function(entries) {
        assert.equal(entries.length, 1);
        var entry = entries[0];
        assert.equal(entry.count, 1);
        var card = entry.card;
        var actual = card.name;
        assert.equal(actual, expected);
      });
  });

  test.it('clicking on deck card should remove it from the deck', function() {
    deckbuilder
      .cardpool()
      .then(function(cards) {
        var card = cards[0];
        return card.click();
      })
      .then(function() {
        return deckbuilder.deck();
      })
      .then(function(entries) {
        var entry = entries[0];
        var card = entry.card;
        return card.click();
      })
      .then(function() {
        return deckbuilder.deck();
      })
      .then(function(entries) {
        assert.equal(entries.length, 0);
      });
  });

  test.it('clicking on cardpool card in deck should increment', function() {
    var card;
    deckbuilder
      .cardpool()
      .then(function(cards) {
        card = cards[0];
        return card.click();
      })
      .then(function() {
        // Click it again!
        return card.click();
      })
      .then(function() {
        return deckbuilder.deck();
      })
      .then(function(entries) {
        assert.equal(entries.length, 1, 'should only be one entry');
        var entry = entries[0];
        assert.equal(entry.count, 2, 'should have a count of 2');
      });
  });

  test.it('clicking on deck card should decrement', function() {
    var card;
    deckbuilder
      .cardpool()
      .then(function(cards) {
        card = cards[0];
        return card.click();
      })
      .then(function() {
        // Click it again!
        return card.click();
      })
      .then(function() {
        return deckbuilder.deck();
      })
      .then(function(entries) {
        var entry = entries[0];
        var card = entry.card;
        return card.click();
      })
      .then(function() {
        return deckbuilder.deck();
      })
      .then(function(entries) {
        assert.equal(entries.length, 1);
        var entry = entries[0];
        assert.equal(entry.count, 1);
      });
  });

  test.it('should not allow up to four of a kind', function() {
    var card;
    deckbuilder
      .cardpool()
      .then(function(cards) {
        card = cards[0];
        return card.click();
      })
      .then(function() {
        // Click it again!
        return card.click();
      })
      .then(function() {
        // And again!
        return card.click();
      })
      .then(function() {
        // And once more for good measure...
        return card.click();
      })
      .then(function() {
        return deckbuilder.deck();
      })
      .then(function(entries) {
        assert.equal(entries.length, 1, 'should only be one entry');
        var entry = entries[0];
        assert.equal(entry.count, 4, 'should have a count of 4');
        // And if we click a 5th time...
        return card.click();
      })
      .then(function() {
        return deckbuilder.deck();
      })
      .then(function(entries) {
        var entry = entries[0];
        assert.equal(entry.count, 4, 'should not allow more than 4');
      });
  });

  test.it.skip('save and load should work', function() {
    // TODO(gareth)
  });

  test.it('discard should throwaway draft', function() {
    var expected;
    deckbuilder
      .cardpool()
      .then(function(cards) {
        var card = cards[0];
        expected = card.name;
        return card.click();
      })
      .then(function() {
        return deckbuilder.discard();
      })
      .then(function() {
        return deckbuilder.deck();
      })
      .then(function(entries) {
        assert.equal(entries.length, 0);
      });
  });
});
