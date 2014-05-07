/* global Games */

describe('Games', function() {
  var subject, game;

  beforeEach(function() {
    subject = Games;

    game =  {
      players: ['me', 'them'],

      playerToDeck: {
        me: { list: [], name: 'My Deck' },
        them: { list: [], name: 'Their Deck' }
      }
    };
  });

  describe('#getOpponent', function() {
    it('should return player other than user', function() {
      assert.strictEqual(subject.getOpponent(game), 'them');
    });
  });

  describe('#startGame', function() {
    it.skip('should initialize game object', function() {
      subject.startGame();

      // TODO(gareth): Check that the game state looks right.
    });
  });
});
