describe('game', function() {
  var subject;

  beforeEach(function(done) {
    subject = Template.game;

    Session.set('game.game', {
      players: ['me', 'them'],

      playerToDeck: {
        me: { list: [], name: 'My Deck' },
        them: { list: [], name: 'Their Deck' }
      }
    });

    subject.rendered();
    setTimeout(done, 0);
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
    it.skip('should return my deck count if me', function() {
    });

    it.skip('should return their deck count if them', function() {
    });
  });

  describe('#handCount', function() {
    it.skip('should return my hand count if me', function() {
    });

    it.skip('should return their hand count if them', function() {
    });
  });

  describe('#graveyardCount', function() {
    it.skip('should return my graveyard count if me', function() {
    });

    it.skip('should return their graveyard count if them', function() {
    });
  });

  describe('#life', function() {
    it.skip('should return my life if me', function() {
    });

    it.skip('should return their life if them', function() {
    });
  });

  describe('#hand', function() {
    it.skip('should return an array of cards in hand', function() {
    });

    it.skip('should eventually add tooltips to the cards', function() {
    });
  });

  describe('#field', function() {
    it.skip('should return my field cards if me', function() {
    });

    it.skip('should return their field cards if them', function() {
    });
  });

  describe('#inspect', function() {
    it.skip('should return the currently inspected card', function() {
    });
  });

  describe('#blue', function() {
    it.skip('should return my blue energy if me', function() {
    });

    it.skip('should return their blue energy if them', function() {
    });
  });
});
