var Card = require('./card'),
    Gameplayer = require('./gameplayer'),
    Q = require('q'),
    view = require('./view'),
    webdriver = require('selenium-webdriver');

function Gameplay() {
}
module.exports = Gameplay;

Gameplay.prototype = {
  waitUntilLoaded: function() {
    return view.waitUntilLoaded('#game');
  },

  getMe: function() {
    return driver
      .findElement(webdriver.By.css('.tray-me'))
      .then(function(element) {
        return Gameplayer.fromTray(element);
      });
  },

  getMeField: function() {
    return driver
      .findElements(webdriver.By.css('.field-me > .card'))
      .then(function(elements) {
        return Q.all(elements.map(Card.fromGame));
      });
  },

  getThem: function() {
    return driver
      .findElement(webdriver.By.css('.tray-them'))
      .then(function(element) {
        return Gameplayer.fromTray(element);
      });
  },

  getThemField: function() {
    return driver
      .findElements(webdriver.By.css('.field-them > .card'))
      .then(function(elements) {
        return Q.all(elements.map(Card.fromGame));
      });
  },

  getHand: function() {
    return driver
      .findElements(webdriver.By.css('.hand > .card'))
      .then(function(elements) {
        return Q.all(elements.map(Card.fromGame));
      });
  },

  draw: function() {
    return driver
      .findElement(webdriver.By.className('deck-me'))
      .then(function(element) {
        return element.click();
      });
  },

  /**
   * Get the card that's being inspected.
   */
  inspect: function() {
    return driver
      .findElement(webdriver.By.css('.inspect > .card'))
      .then(function(element) {
        return Card.fromGame(element);
      });
  }
};
