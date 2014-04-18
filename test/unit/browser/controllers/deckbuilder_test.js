describe('deckbuilder', function() {
  var subject;

  beforeEach(function() {
    subject = Template.deckbuilder;
  });

  describe('#created', function() {
    it('should reset filters', function() {
      var mock = sinon.mock(Session);
      mock.expects('set').withArgs('filters');
      subject.created();
      mock.verify();
      mock.restore();
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
      stub.withArgs('deck').returns({ list: [] });
      assert.ok(subject.isDisabled());
    });

    it('should be enabled if list length >0', function() {
      stub.withArgs('deck').returns({ list: [{}] });
      assert.notOk(subject.isDisabled());
    });
  });

  describe('#cardpool', function() {
    it.skip('should return all cards with no filters', function() {
      // TODO(gareth)
    });

    it.skip('should obey color filter', function() {
      // TODO(gareth)
    });

    it.skip('should obey cardtype filter', function() {
      // TODO(gareth)
    });

    it.skip('should obey name search', function() {
      // TODO(gareth)
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
      stub.withArgs('deck').returns(null);
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

      stub.withArgs('deck').returns(deck);

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
      stub.withArgs('deck').returns({ name: null });
      var name = subject.deckname();
      assert.equal(name, 'Untitled');
    });

    it('should have return name if name', function() {
      stub.withArgs('deck').returns({ name: 'TMNT' });
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
