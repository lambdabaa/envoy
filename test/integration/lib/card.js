var Q = require('q'),
    webdriver = require('selenium-webdriver');

function Card() {
}
module.exports = Card;

Card.fromCardpool = function(element) {
  return Q.all([
    fromCardpool.name(element),
    fromCardpool.color(element),
    fromCardpool.image(element),
    fromCardpool.cardtype(element),
    fromCardpool.cost(element),
    fromCardpool.description(element),
    fromCardpool.power(element),
    fromCardpool.hp(element)
  ])
  .spread(function(name, color, image, type, cost, description, power, hp) {
    var card = new Card();
    card.location = 'cardpool';
    card.name = name;
    card.color = color;
    card.image = image;
    card.cardtype = type;
    card.cost = cost;
    card.description = description;
    card.power = power;
    card.hp = hp;
    return card;
  });
};

var fromCardpool = {
  name: function(element) {
    return element
      .findElement(webdriver.By.css('.card-name'))
      .then(function(nameElement) {
        return nameElement.getText();
      });
  },

  color: function(element) {
    return element
      .getAttribute('className')
      .then(function(className) {
        return /(blue|green|purple|red|white)/.exec(className)[0];
      });
  },

  image: function(element) {
    return element
      .findElement(webdriver.By.css('.card-image'))
      .getAttribute('src');
  },

  cardtype: function(element) {
    return element
      .findElement(webdriver.By.css('.card-type'))
      .getText();
  },

  cost: function(element) {
    var color = element
      .findElement(webdriver.By.css('.card-color-cost'))
      .getText();
    var colorless = element
      .findElement(webdriver.By.css('.card-colorless-cost'))
      .getText();
    return Q.all([
      colorless,
      color
    ])
    .spread(function(colorless, color) {
      return {
        color: +color,
        colorless: +colorless
      };
    });
  },

  description: function(element) {
    return element
      .findElement(webdriver.By.css('.card-description'))
      .getText();
  },

  power: function(element) {
    return element
      .findElement(webdriver.By.css('.card-combat'))
      .getText()
      .then(function(text) {
        if (!text) {
          return null;
        }

        return +text.split('/')[0].replace(/\s/, '');
      });
  },

  hp: function(element) {
    return element
      .findElement(webdriver.By.css('.card-combat'))
      .getText()
      .then(function(text) {
        if (!text) {
          return null;
        }

        return +text.split('/')[1].replace(/\s/, '');
      });
  }
};

Card.fromDeck = function(element) {
  return Q.all([
    fromDeck.count(element),
    fromDeck.name(element),
    fromDeck.cardtype(element),
    fromDeck.cost(element)
  ]).spread(function(count, name, cardtype, cost) {
    var card = new Card();
    card.location = 'deck';
    card.name = name;
    card.cardtype = cardtype;
    card.cost = cost;
    return { card: card, count: count };
  });
};

var fromDeck = {
  count: function(element) {
    return element
      .findElement(webdriver.By.css('td[name="count"]'))
      .getText()
      .then(function(text) {
        return +text;
      });
  },

  name: function(element) {
    return element
      .findElement(webdriver.By.css('td[name="name"]'))
      .getText();
  },

  cardtype: function(element) {
    return element
      .findElement(webdriver.By.css('td[name="cardtype"]'))
      .getText();
  },

  cost: function(element) {
    return element
      .findElement(webdriver.By.css('td[name="cost"]'))
      .getText();
  }
};

Card.prototype = {
  name: null,

  color: null,

  image: null,

  cardtype: null,

  cost: null,

  description: null,

  power: null,

  hp: null,

  location: null,

  findElement: function() {
    var css;
    switch (this.location) {
      case 'cardpool':
        css = '#cardpool .card[name="' + this.name + '"]';
        break;
      case 'deck':
        css = '#deck .deck-entry[name="' + this.name + '"]';
        break;
    }

    return driver.findElement(webdriver.By.css(css));
  },

  click: function() {
    return this
      .findElement()
      .click();
  },

  toString: function(element) {
    return JSON.stringify({
      name: this.name,
      color: this.color,
      image: this.image,
      cardtype: this.cardtype,
      cost: this.cost,
      description: this.description,
      power: this.power,
      hp: this.hp
    });
  }
};
