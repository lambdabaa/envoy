describe('games', function() {
  var subject, game;

  beforeEach(function() {
    subject = Template.games;

    game = {
      players: ['them', 'me'],

      playerToDeck: {
        me: {
          list: [
            { card: { name: 'Linus' }, count: 4 }
          ],
          name: 'My Deck'
        },
        them: {
          list: [
            { card: { name: 'Samson' }, count: 3 }
          ],
          name: 'Their Deck'
        }
      }
    };
  });

  describe('#host', function() {
    it('should return player one name', function() {
      assert.strictEqual(subject.host(game), 'Yoda');
    });
  });

  describe('#opponent', function() {
    it('should return player two name', function() {
      assert.strictEqual(subject.opponent(game), 'Buddha');
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
