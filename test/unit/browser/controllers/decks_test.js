describe('decks', function() {
  var subject, mockSession;

  beforeEach(function() {
    subject = Template.decks;
  });

  describe('#decks', function() {
    it.skip('should fetch all logged in user decks', function() {
    });
  });

  describe('#cardCount', function() {
    it('should equal the sum of the entry counts', function() {
      assert.equal(subject.cardCount({
        list: [
          { count: 2 },
          { count: 2 }
        ]
      }), 4);
    });

    describe('#colors', function() {
      it('should compute the deck colors', function() {
        assert.equal(subject.colors({
          list: [
            { card: { color: 'purple' } },
            { card: { color: 'purple' } },
            { card: { color: 'white' } }
          ]
        }), 'P,W');
      });
    });
  });
});
