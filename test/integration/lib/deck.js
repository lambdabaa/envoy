var Q = require('q'),
    webdriver = require('selenium-webdriver');

function Deck() {
}
module.exports = Deck;

Deck.fromListRow = function(element) {
  return Q.all([
    fromListRow.name(element),
    fromListRow.cards(element),
    fromListRow.colors(element)
  ])
  .spread(function(name, cards, colors) {
    var deck = new Deck();
    deck.name = name;
    deck.cards = +cards;
    deck.colors = colors;
    return deck;
  });
};

var fromListRow = {
  name: function(element) {
    return element
      .findElement(webdriver.By.css('td[name="name"]'))
      .then(function(nameElement) {
        return nameElement.getText();
      });
  },

  cards: function(element) {
    return element
      .findElement(webdriver.By.css('td[name="cards"]'))
      .then(function(cardsElement) {
        return cardsElement.getText();
      });
  },

  colors: function(element) {
    return element
      .findElement(webdriver.By.css('td[name="colors"]'))
      .then(function(colorsElement) {
        return colorsElement.getText();
      })
      .then(function(colorsText) {
        if (/^\s*$/.test(colorsText)) {
          return [];
        }

        return colorsText
          .split(',')
          .map(function(color) {
            switch (color) {
              case 'B':
                return 'blue';
              case 'G':
                return 'green';
              case 'P':
                return 'purple';
              case 'R':
                return 'red';
              case 'W':
                return 'white';
            }
          });
      });
  }
};

Deck.prototype = {
  name: null,

  cards: null,

  colors: null,

  toString: function() {
    return JSON.stringify({
      name: this.name,
      count: this.count,
      colors: this.colors
    });
  }
};
