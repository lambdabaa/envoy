var Card = require('./lib/card'),
    DeckBuilder = require('./lib/deckbuilder'),
    Decks = require('./lib/decks'),
    Q = require('q'),
    url = require('url');

var COLORS = ['blue', 'green', 'purple', 'red', 'white'];

describe('deckbuilder', function() {
  var deckbuilder;

  before(function() {
    deckbuilder = new DeckBuilder();
  });

  beforeEach(function() {
    return deckbuilder.launch();
  });

  it('deckname should be initially untitled', function() {
    return Q.all([
      deckbuilder.getName(),
      driver.getCurrentUrl()
    ])
    .spread(function(name, currentUrl) {
      var pathname = url.parse(currentUrl).pathname;
      assert.strictEqual(name, 'Untitled');
      assert.strictEqual(pathname, '/decks/new');
    });
  });

  it('deckname should be editable', function() {
    return deckbuilder
      .setName('Chicken Fried')
      .then(function() {
        return driver.wait(function() {
          return Q.all([
            deckbuilder.getName(),
            driver.getCurrentUrl()
          ])
          .spread(function(name, currentUrl) {
            var pathname = url.parse(currentUrl).pathname;
            return name === 'Chicken Fried' &&
                   pathname === '/decks/Chicken%20Fried';
          });
        });
      });
  });

  it('cardpool should have cards', function() {
    return deckbuilder
      .cardpool()
      .then(function(cards) {
        assert.isArray(cards);
        cards.forEach(function(card) {
          assert.instanceOf(card, Card);
          assert.typeOf(card.name, 'string');
          assert.ok(card.name.length > 0, 'should have nonzero length name');
          assert.include(COLORS, card.color);
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

  it.skip('cardpool should allow scrolling to see more cards', function() {
    // TODO(gareth)
  });

  it('color filters should update cardpool', function() {
    function includeColor(cards, color) {
      return cards.some(function(card) {
        return card.color === color;
      });
    }

    return deckbuilder
      .cardpool()
      .then(function(cards) {
        assert.ok(includeColor(cards, 'purple'));
      })
      .then(function() {
        return deckbuilder.toggleFilter('color', 'purple');
      })
      .then(function() {
        return deckbuilder.cardpool();
      })
      .then(function(cards) {
        assert.notOk(includeColor(cards, 'purple'));
      })
      .then(function() {
        return deckbuilder.toggleFilter('color', 'purple');
      })
      .then(function() {
        return deckbuilder.cardpool();
      })
      .then(function(cards) {
        assert.ok(includeColor(cards, 'purple'));
      });
  });

  it('cardtype filters should update cardpool', function() {
    function includeEnvoy(cards) {
      return cards.some(function(card) {
        return card.cardtype.indexOf('Envoy') !== -1;
      });
    }

    return deckbuilder
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

  it('search should update cardpool', function() {
    var expected;
    return deckbuilder
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

  it('deck should be initially empty', function() {
    return deckbuilder
      .deck()
      .then(function(entries) {
        assert.isArray(entries);
        assert.equal(entries.length, 0);
      });
  });

  it('clicking on a cardpool card should add it to the deck', function() {
    var expected;
    return deckbuilder
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

  it('clicking on deck card should remove it from the deck', function() {
    return deckbuilder
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

  it('clicking on cardpool card in deck should increment', function() {
    var card;
    return deckbuilder
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

  it('clicking on deck card should decrement', function() {
    var card;
    return deckbuilder
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

  it('should allow up to four of a kind', function() {
    var card;
    return deckbuilder
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

  it('saving a deck should work', function() {
    return deckbuilder
      .cardpool()
      .then(function(cards) {
        var card = cards[0];
        return card.click();
      })
      .then(function() {
        return deckbuilder.save();
      })
      .then(function() {
        // We should be prompted to set our deck's name first.
        return driver
          .switchTo()
          .alert()
          .accept();
      })
      .then(function() {
        return deckbuilder.setName('Chicken Fried');
      })
      .then(function() {
        return driver.wait(function() {
          return Q.all([
            deckbuilder.getName(),
            driver.getCurrentUrl()
          ])
          .spread(function(name, currentUrl) {
            var pathname = url.parse(currentUrl).pathname;
            return name === 'Chicken Fried' &&
                   pathname === '/decks/Chicken%20Fried';
          });
        });
      });
  });

  it('loading a deck should work', function() {
    var expected;
    return deckbuilder
      .setName('Chicken Fried')
      .then(function() {
        return deckbuilder.cardpool();
      })
      .then(function(cards) {
        expected = cards[0];
        return expected.click();
      })
      .then(function() {
        return deckbuilder.save();
      })
      .then(function() {
        // Navigate away.
        var decks = new Decks();
        return decks.launch();
      })
      .then(function() {
        // Navigate back.
        return deckbuilder.launch();
      })
      .then(function() {
        return deckbuilder.load('Chicken Fried');
      })
      .then(function() {
        return Q.all([
          deckbuilder.getName(),
          driver.getCurrentUrl(),
          deckbuilder.deck()
        ])
        .spread(function(name, currentUrl, entries) {
          assert.equal(name, 'Chicken Fried');
          var pathname = url.parse(currentUrl).pathname;
          assert.equal(pathname, '/decks/Chicken%20Fried');
          assert.isArray(entries);
          assert.lengthOf(entries, 1);
          var entry = entries[0];
          assert.equal(entry.count, 1);
          assert.equal(entry.card.name, expected.name);
          assert.equal(entry.card.cardtype, expected.cardtype);
        });
      });
  });

  it('discard should throwaway draft', function() {
    var expected;
    return deckbuilder
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
