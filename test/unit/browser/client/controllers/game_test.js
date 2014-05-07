/* global wait */

describe('game', function() {
  var subject;

  beforeEach(function() {
    subject = Template.game;

    Session.set('game.game', {
      players: ['me', 'them'],

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
    });

    subject.rendered();
  });

  describe('#me', function() {
    it('should return my profile name', function() {
      assert.strictEqual(subject.me(), 'Buddha');
    });
  });

  describe('#them', function() {
    it('should return opponent profile name', function() {
      assert.strictEqual(subject.them(), 'Yoda');
    });
  });

  describe('#deckCount', function() {
    it('should return my deck count if me', function() {
      assert.strictEqual(subject.deckCount('me'), 4);
    });

    it('should return their deck count if them', function() {
      assert.strictEqual(subject.deckCount('them'), 3);
    });
  });

  describe('#handCount', function() {
    it('should return my hand count if me', function() {
      var game = Session.get('game.game');
      var playerToHand = game.playerToHand;
      playerToHand.me = [1, 2, 3];
      assert.strictEqual(subject.handCount('me'), 3);
    });

    it('should return their hand count if them', function() {
      var game = Session.get('game.game');
      var playerToHand = game.playerToHand;
      playerToHand.them = [1, 2, 3, 4, 5];
      assert.strictEqual(subject.handCount('them'), 5);
    });
  });

  describe('#graveyardCount', function() {
    it('should return my graveyard count if me', function() {
      var game = Session.get('game.game');
      var playerToGraveyard = game.playerToGraveyard;
      playerToGraveyard.me = [1, 2, 3];
      assert.strictEqual(subject.graveyardCount('me'), 3);
    });

    it('should return their graveyard count if them', function() {
      var game = Session.get('game.game');
      var playerToGraveyard = game.playerToGraveyard;
      playerToGraveyard.them = [1, 2, 3, 4, 5];
      assert.strictEqual(subject.graveyardCount('them'), 5);
    });
  });

  describe('#life', function() {
    it('should return my life if me', function() {
      var game = Session.get('game.game');
      var playerToLife = game.playerToLife;
      playerToLife.me = 5;
      assert.strictEqual(subject.life('me'), 5);
    });

    it('should return their life if them', function() {
      var game = Session.get('game.game');
      var playerToLife = game.playerToLife;
      playerToLife.them = 10;
      assert.strictEqual(subject.life('them'), 10);
    });
  });

  describe('#hand', function() {
    var stub;

    beforeEach(function() {
      stub = sinon.stub(subject, '_addTooltipsToCards');
    });

    afterEach(function() {
      subject._addTooltipsToCards.restore();
    });

    it('should return an array of cards in hand', function() {
      assert.lengthOf(subject.hand(), 0);
      subject._draw();
      var hand = subject.hand();
      assert.lengthOf(hand, 1);
      var linus = hand[0];
      assert.strictEqual(linus.name, 'Linus');
    });

    it('should eventually add tooltips to the cards', function(done) {
      subject.hand();
      wait(function() {
        return stub.called;
      }, done);
    });
  });

  describe('#field', function() {
    it('should return my field cards if me', function() {
      var linus = { name: 'Linus' };
      var game = Session.get('game.game');
      var playerToField = game.playerToField;
      playerToField.me = [linus];
      assert.deepEqual(subject.field('me'), [linus]);
    });

    it('should return their field cards if them', function() {
      var samson = { name: 'Samson' };
      var game = Session.get('game.game');
      var playerToField = game.playerToField;
      playerToField.them = [samson];
      assert.deepEqual(subject.field('them'), [samson]);
    });
  });

  describe('#inspect', function() {
    it('should return the currently inspected card', function() {
      var sheep = { wool: true };
      Session.set('game.inspect', sheep);
      assert.deepEqual(subject.inspect(), sheep);
    });
  });

  describe('#blue', function() {
    it('should return my blue energy if me', function() {
      var game = Session.get('game.game');
      var playerToEnergyAvailable = game.playerToEnergyAvailable;
      playerToEnergyAvailable.me.blue = 5;
      assert.strictEqual(subject.blue('me'), 5);
    });

    it('should return their blue energy if them', function() {
      var game = Session.get('game.game');
      var playerToEnergyAvailable = game.playerToEnergyAvailable;
      playerToEnergyAvailable.them.blue = 10;
      assert.strictEqual(subject.blue('them'), 10);
    });
  });
});
