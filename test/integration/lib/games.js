var Game = require('./game'),
    Q = require('q'),
    view = require('./view'),
    webdriver = require('selenium-webdriver');

function Games() {
}
module.exports = Games;

Games.prototype = {
  launch: function() {
    return view.launch('/games', '#games');
  },

  create: function(deckname) {
    // Click create game.
    return driver
      .findElement(webdriver.By.css('.create-game'))
      .click()
      .then(function() {
        // Wait for deck selection dialog to appear.
        return driver.wait(function() {
          return driver
            .findElement(webdriver.By.css('#create-game .configure-game'))
            .isDisplayed();
        });
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css(
            '#create-game input[value="' + deckname + '"]'
          ))
          .click();
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css('#create-game button[type="submit"]'))
          .click();
      });
  },

  getAll: function() {
    return driver
      .findElements(webdriver.By.css('.game'))
      .then(function(elements) {
        return Q.all(elements.map(Game.fromListRow));
      });
  },

  joinGameAt: function(index, deckname) {
    return driver
      .findElements(webdriver.By.css('.game'))
      .then(function(elements) {
        // TODO(gareth): Not sure findElements preserves the order we need...
        var element = elements[index];
        return element
          .findElement(webdriver.By.css('td[name="status"] > span.label'))
          .click();
      })
      .then(function() {
        // Wait for deck selection dialog to appear.
        return driver.wait(function() {
          return driver
            .findElement(webdriver.By.css('#choose-deck .select-deck'))
            .isDisplayed();
        });
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css(
            '#choose-deck input[value="' + deckname + '"]'
          ))
          .click();
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css('#choose-deck button[type="submit"]'))
          .click();
      });
  }
};
