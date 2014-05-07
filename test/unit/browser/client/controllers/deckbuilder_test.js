/* global Cards */

describe('deckbuilder', function() {
  var subject;

  beforeEach(function() {
    subject = Template.deckbuilder;
  });

  describe('#created', function() {
    it('should reset filters', function() {
      assert.isUndefined(Session.get('deckbuilder.filters'));
      subject.created();
      var filters = Session.get('deckbuilder.filters');
      assert.typeOf(filters.color, 'object');
      assert.typeOf(filters.cardtype, 'object');
      assert.strictEqual(filters.search, '');
    });
  });

  describe('#isDisabled', function() {
    var stub;

    beforeEach(function() {
      stub = sinon.stub(Session, 'get');
    });

    afterEach(function() {
      Session.get.restore();
    });

    it('should be disabled if list length 0', function() {
      stub
        .withArgs('deckbuilder.deck')
        .returns({ list: [] });
      assert.ok(subject.isDisabled());
    });

    it('should be enabled if list length >0', function() {
      stub
        .withArgs('deckbuilder.deck')
        .returns({ list: [{}] });
      assert.notOk(subject.isDisabled());
    });
  });

  describe('#cardpool', function() {
    var cards, filters, chronicSpy, spill, volleyOfArrows;

    beforeEach(function() {
      chronicSpy = {
        name: 'Chronic Spy',
        color: 'blue',
        cardtype: {
          primary: 'Envoy'
        }
      };

      spill = {
        name: 'Spill',
        color: 'purple',
        cardtype: {
          primary: 'Spell'
        }
      };

      volleyOfArrows = {
        name: 'Volley of Arrows',
        color: 'white',
        cardtype: {
          primary: 'Trap'
        }
      };


      cards = [chronicSpy, spill, volleyOfArrows];

      sinon
        .stub(Cards, 'find')
        .returns({
          fetch: function() {
            return cards;
          }
        });

      filters = {
        color: {
          blue: false,
          green: false,
          purple: false,
          red: false,
          white: false
        },

        cardtype: {
          envoy: false,
          spell: false,
          trap: false
        },

        search: ''
      };
    });

    afterEach(function() {
      Cards.find.restore();
    });

    it('should return all cards with no filters', function() {
      Session.set('deckbuilder.filters', filters);
      assert.deepEqual(subject.cardpool(), cards);
    });

    it('should obey color filter', function() {
      filters.color.blue = true;
      Session.set('deckbuilder.filters', filters);

      var withoutBlue = _.reject(cards, function(card) {
        return card.color === 'blue';
      });
      assert.deepEqual(subject.cardpool(), withoutBlue);
    });

    it('should obey cardtype filter', function() {
      filters.cardtype.envoy = true;
      Session.set('deckbuilder.filters', filters);

      var withoutEnvoys = _.reject(cards, function(card) {
        return card.cardtype.primary === 'Envoy';
      });
      assert.deepEqual(subject.cardpool(), withoutEnvoys);
    });

    it('should obey name search', function() {
      filters.search = 'Chronic';
      Session.set('deckbuilder.filters', filters);

      assert.deepEqual(subject.cardpool(), [chronicSpy]);
    });
  });

  describe('#deck', function() {
    var stub;

    beforeEach(function() {
      stub = sinon.stub(Session, 'get');
    });

    afterEach(function() {
      Session.get.restore();
    });

    it('should return empty array if no deck', function() {
      stub
        .withArgs('deckbuilder.deck')
        .returns(null);
      var deck = subject.deck();
      assert.isArray(deck);
      assert.lengthOf(deck, 0);
    });

    it('should return entries list with counts', function() {
      var deck = {
        list: [
          { card: { name: 'Pony' }, count: 3 },
          { card: { name: 'Panda' }, count: 1 }
        ]
      };

      stub
        .withArgs('deckbuilder.deck')
        .returns(deck);

      var result = subject.deck();
      assert.lengthOf(result, 2);
      assert.include(result, { name: 'Pony', count: 3 });
      assert.include(result, { name: 'Panda', count: 1 });
    });
  });

  describe('#deckname', function() {
    var stub;

    beforeEach(function() {
      stub = sinon.stub(Session, 'get');
    });

    afterEach(function() {
      Session.get.restore();
    });

    it('should be untitled if no name', function() {
      stub
        .withArgs('deckbuilder.deck')
        .returns({ name: null });
      var name = subject.deckname();
      assert.equal(name, 'Untitled');
    });

    it('should have return name if name', function() {
      stub
        .withArgs('deckbuilder.deck')
        .returns({ name: 'TMNT' });
      var name = subject.deckname();
      assert.equal(name, 'TMNT');
    });
  });

  describe('#formatCardtype', function() {
    it('should failover to primary if no secondary', function() {
      assert.equal(subject.formatCardtype({
        cardtype: {
          primary: 'Trap'
        }
      }), 'Trap');
    });

    it('should build compound type if primary and secondary', function() {
      assert.equal(subject.formatCardtype({
        cardtype: {
          primary: 'Envoy',
          secondary: 'Poodle'
        }
      }), 'Envoy - Poodle');
    });
  });

  describe('#formatCost', function() {
    it('should build correct format', function() {
      assert.equal(subject.formatCost({
        color: 'green',
        cost: {
          colorless: 1,
          color: 2
        }
      }), '1GG');
    });
  });
});
