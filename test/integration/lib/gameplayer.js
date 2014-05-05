var Q = require('q'),
    webdriver = require('selenium-webdriver');

function Gameplayer() {
}
module.exports = Gameplayer;

Gameplayer.fromTray = function(element) {
  return Q
    .all([
      fromTray.name(element),
      fromTray.life(element),
      fromTray.deck(element),
      fromTray.hand(element),
      fromTray.graveyard(element),
      fromTray.energy(element)
    ])
    .spread(function(name, life, deck, hand, graveyard, energy) {
      var gameplayer = new Gameplayer();
      gameplayer.name = name;
      gameplayer.life = life;
      gameplayer.deck = deck;
      gameplayer.hand = hand;
      gameplayer.graveyard = graveyard;
      gameplayer.energy = energy;
      return gameplayer;
    });
};

var fromTray = {
  name: function(element) {
    return element
      .findElement(webdriver.By.css('.tray-data > .name'))
      .then(function(nameElement) {
        return nameElement.getText();
      });
  },

  life: function(element) {
    return element
      .findElement(webdriver.By.css('.tray-data > .life'))
      .then(function(lifeElement) {
        return lifeElement.getText();
      })
      .then(function(text) {
        return +text.replace('Life: ', '');
      });
  },

  deck: function(element) {
    return element
      .findElement(webdriver.By.css('.tray-data > .deck'))
      .then(function(deckElement) {
        return deckElement.getText();
      })
      .then(function(text) {
        return +text.replace('Deck: ', '');
      });
  },

  hand: function(element) {
    return element
      .findElement(webdriver.By.css('.tray-data > .hand'))
      .then(function(handElement) {
        return handElement.getText();
      })
      .then(function(text) {
        return +text.replace('Hand: ', '');
      });
  },

  graveyard: function(element) {
    return element
      .findElement(webdriver.By.css('.tray-data > .graveyard'))
      .then(function(graveyardElement) {
        return graveyardElement.getText();
      })
      .then(function(text) {
        return +text.replace('Graveyard: ', '');
      });
  },

  energy: function(element) {
    return Q
      .all([
        'blue',
        'green',
        'purple',
        'red',
        'white'
      ].map(function(color) {
        return element
          .findElement(webdriver.By.className(color))
          .then(function(colorElement) {
            return colorElement.getText();
          });
      }))
      .spread(function(blue, green, purple, red, white) {
        return {
          blue: +blue,
          green: +green,
          purple: +purple,
          red: +red,
          white: +white
        };
      });
  }
};

Gameplayer.prototype = {
  name: null,

  life: null,

  deck: null,

  hand: null,

  graveyard: null,

  energy: null
};
