describe('games', function() {
  var subject;

  beforeEach(function() {
    subject = Template.games;
  });

  describe('#host', function() {
    it.skip('should return player one name', function() {
    });
  });

  describe('#opponent', function() {
    it.skip('should return player two name', function() {
    });
  });

  describe('#status', function() {
    it('should be in progress if two or more players', function() {
      assert.equal(
        subject.status({ players: ['me', 'them'] }),
        '<span class="label label-danger">In progress</span>'
      );
    });

    it('should be waiting if active user created', function() {
      assert.equal(
        subject.status({ players: ['me'] }),
        '<span class="label label-warning">Waiting for opponent...</span>'
      );
    });

    it('should be joinable if somebody else created', function() {
      assert.equal(
        subject.status({ players: ['them'] }),
        '<span class="label label-success">Click to join!</span>'
      );
    });
  });
});
