var DeckBuilder = require('./lib/deckbuilder'),
    FacebookLogin = require('./lib/facebook_login'),
    Gameplay = require('./lib/gameplay'),
    Games = require('./lib/games'),
    debug = require('debug')('envoy:games_test');

describe('games', function() {
  var deckbuilder, gameplay, games, login;

  beforeEach(function() {
    deckbuilder = new DeckBuilder();
    gameplay = new Gameplay();
    games = new Games();
    login = new FacebookLogin();
    return login
      .authorize(DONNA)
      .then(function() {
        debug('Create a deck.');
        return deckbuilder.launch();
      })
      .then(function() {
        return deckbuilder.createDeck({ name: 'mouserat' });
      })
      .then(function() {
        return games.launch();
      });
  });

  it('list should initially be empty', function() {
    return games
      .getAll()
      .then(function(list) {
        assert.lengthOf(list, 0);
      });
  });

  describe('create game', function() {
    beforeEach(function() {
      return games.create('mouserat');
    });

    it('should queue game waiting for opponent', function() {
      return games
        .getAll()
        .then(function(list) {
          assert.lengthOf(list, 1);
          var game = list[0];
          assert.strictEqual(game.host, DONNA.name);
          assert.strictEqual(game.opponent, '');
          assert.strictEqual(game.status, 'Waiting for opponent...');
        });
    });

    describe('other player', function() {
      var previous, second;

      beforeEach(function() {
        previous = driver;
        second = client();
        switchToClient(second);

        login
          .authorize(JOE)
          .then(function() {
            return deckbuilder.launch();
          })
          .then(function() {
            return deckbuilder.createDeck({ name: 'ratmouse' });
          })
          .then(function() {
            return games.launch();
          });
      });

      afterEach(function() {
        switchToClient(previous);
        return second.quit();
      });

      it('should be able to join', function() {
        return games
          .getAll()
          .then(function(list) {
            var game = list[0];
            assert.strictEqual(game.host, DONNA.name);
            assert.strictEqual(game.opponent, '');
            assert.strictEqual(game.status, 'Click to join!');
          })
          .then(function() {
            return games.joinGameAt(0, 'ratmouse');
          })
          .then(function() {
            return gameplay.waitUntilLoaded();
          })
          .then(function() {
            // Switch back to the "host" driver.
            switchToClient(previous);
            return games.getAll();
          })
          .then(function(list) {
            var game = list[0];
            assert.strictEqual(game.host, DONNA.name);
            assert.strictEqual(game.opponent, JOE.name);
            assert.strictEqual(game.status, 'In progress');
          });
      });
    });
  });
});
