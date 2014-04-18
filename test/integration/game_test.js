var Card = require('./lib/card'),
    DeckBuilder = require('./lib/deckbuilder'),
    FacebookLogin = require('./lib/facebook_login'),
    Gameplay = require('./lib/gameplay'),
    Games = require('./lib/games'),
    debug = require('debug')('envoy:game_test'),
    helper = require('./lib/helper'),
    webdriver = require('selenium-webdriver');

describe('game', function() {
  var deckbuilder, gameplay, games, login;

  // Clients
  var playerOne, playerTwo;

  beforeEach(function() {
    playerOne = driver;
    debug('Create second client.');
    playerTwo = client();

    // Create a game between two players and have both players join.
    deckbuilder = new DeckBuilder();
    gameplay = new Gameplay();
    games = new Games();
    login = new FacebookLogin();
    debug('Login Donna.');
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
      })
      .then(function() {
        debug('Create a game.');
        return games.create('mouserat');
      })
      .then(function() {
        debug('Switch to second client.');
        switchToClient(playerTwo);
        debug('Login Joe.');
        return login.authorize(JOE);
      })
      .then(function() {
        debug('Create a deck.');
        return deckbuilder.launch();
      })
      .then(function() {
        return deckbuilder.createDeck({ name: 'ratmouse' });
      })
      .then(function() {
        debug('Join game.');
        return games.launch();
      })
      .then(function() {
        return games.joinGameAt(0, 'ratmouse');
      })
      .then(function() {
        debug('Wait for second client to load game.');
        return playerTwo.wait(function() {
          return gameplay.waitUntilLoaded();
        });
      })
      .then(function() {
        debug('Switch back to first client.');
        switchToClient(playerOne);
        debug('Enter game.');
        return games.enterGameAt(0);
      })
      .then(function() {
        debug('Wait for first client to load game.');
        return gameplay.waitUntilLoaded();
      });
  });

  afterEach(function() {
    // playerOne gets quit by default.
    return playerTwo.quit();
  });

  it('should be set up correctly', function() {
    /* Tray data */
    return gameplay
      .getMe()
      .then(function(me) {
        assert.equal(me.name, DONNA.name);
        assert.equal(me.life, 20);
        assert.operator(me.deck, '>', 0);
        assert.strictEqual(me.hand, 0);
        assert.strictEqual(me.graveyard, 0);
        assert.strictEqual(me.energy.blue, 0);
        assert.strictEqual(me.energy.green, 0);
        assert.strictEqual(me.energy.purple, 0);
        assert.strictEqual(me.energy.red, 0);
        assert.strictEqual(me.energy.white, 0);
      })
      .then(function() {
        return gameplay.getThem();
      })
      .then(function(them) {
        assert.equal(them.name, JOE.name);
        assert.equal(them.life, 20);
        assert.operator(them.deck, '>', 0);
        assert.strictEqual(them.hand, 0);
        assert.strictEqual(them.graveyard, 0);
        assert.strictEqual(them.energy.blue, 0);
        assert.strictEqual(them.energy.green, 0);
        assert.strictEqual(them.energy.purple, 0);
        assert.strictEqual(them.energy.red, 0);
        assert.strictEqual(them.energy.white, 0);
      })

      /* Drawing */

      .then(function() {
        return gameplay.getHand();
      })
      .then(function(hand) {
        assert.lengthOf(hand, 0);
      })
      .then(function() {
        return gameplay.draw();
      })
      .then(function() {
        return gameplay.getHand();
      })
      .then(function(hand) {
        assert.lengthOf(hand, 1);
        var card = hand[0];
        assert.instanceOf(card, Card);
      });
  });

  it('clicking card in hand', function() {
    var card, popoverId;

    return gameplay
      .draw()
      .then(function() {
        return gameplay.getHand();
      })
      .then(function(hand) {
        card = hand[0];
        return card.click();
      })
      .then(function() {
        return gameplay.inspect();
      })
      .then(function(inspected) {
        assert.deepEqual(
          card,
          inspected,
          'Clicking on card should reveal in inspect view'
        );
      })
      .then(function() {
        return card.popover();
      })
      .then(function(popover) {
        popoverId = popover.id;
        assert.match(popover.id, /^popover-/);
        popover.actions.forEach(function(action) {
          assert.strictEqual(action.className, 'card-action');
          assert.include(['play', 'cast'], action.action);
        });
      })
      .then(function() {
        return card.click();
      })
      .then(function() {
        return driver.wait(function() {
          return helper.isPresentAndDisplayed(
            webdriver.By.id(popoverId)
          )
          .then(function(isPresentAndDisplayed) {
            return !isPresentAndDisplayed;
          });
        });
      })
      .then(function() {
        return card.popover();
      })
      .then(function(popover) {
        assert.isNull(popover);
      });
  });

  it('casting card to energy should update energy', function() {
    var card, color;

    return gameplay
      .draw()
      .then(function() {
        return gameplay.getHand();
      })
      .then(function(hand) {
        card = hand[0];
        color = card.color;
        return card.click();
      })
      .then(function() {
        return card.popover();
      })
      .then(function(popover) {
        return popover.click('cast');
      })
      .then(function() {
        return gameplay.getMe();
      })
      .then(function(me) {
        assert.strictEqual(me.energy[color], 1);
      });
  });

  it('playing card should add to player field', function() {
    var card;

    return gameplay
      .draw()
      .then(function() {
        return gameplay.getHand();
      })
      .then(function(hand) {
        card = hand[0];
        return card.click();
      })
      .then(function() {
        return card.popover();
      })
      .then(function(popover) {
        return popover.click('play');
      })
      .then(function() {
        return gameplay.getMeField();
      })
      .then(function(field) {
        assert.lengthOf(field, 1);
        var result = field[0];
        assert.deepEqual(result, card, 'Clicked card should be in play');
      });
  });


  it.skip('players should be able to update life totals', function() {
  });

  it.skip('clicking on card in play should toggle actions', function() {
  });

  it.skip('tap/untap option should change card orientation', function() {
  });

  it.skip('field to graveyard should work', function() {
  });

  it.skip('field to hand should work', function() {
  });

  it.skip('clicking on graveyard should show cards in graveyard', function() {
  });

  it.skip('clicking on graveyard card should toggle actions', function() {
  });

  it.skip('graveyard to field should work', function() {
  });

  it.skip('graveyard to hand should work', function() {
  });
});
