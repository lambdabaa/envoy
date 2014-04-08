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
    var stub, creatorId, opponentId;

    beforeEach(function() {
      creatorId = '1';
      opponentId = '2';
      stub = sinon
        .stub(Meteor, 'userId')
        .returns(creatorId);
    });

    afterEach(function() {
      stub.restore();
    });

    it('should be in progress if two or more players', function() {
      assert.equal(
        subject.status({ players: [creatorId, opponentId] }),
        '<span class="label label-danger">In progress</span>'
      );
    });

    it('should be waiting if active user created', function() {
      assert.equal(
        subject.status({ players: [creatorId] }),
        '<span class="label label-warning">Waiting for opponent...</span>'
      );
    });

    it('should be joinable if somebody else created', function() {
      assert.equal(
        subject.status({ players: [opponentId] }),
        '<span class="label label-success">Click to join!</span>'
      );
    });
  });
});
