var Q = require('q'),
    webdriver = require('selenium-webdriver');

function Game() {
}
module.exports = Game;

Game.fromListRow = function(element) {
  return Q.all([
    fromListRow.host(element),
    fromListRow.opponent(element),
    fromListRow.status(element)
  ])
  .spread(function(host, opponent, status) {
    var game = new Game();
    game.host = host;
    game.opponent = opponent;
    game.status = status;
    return game;
  });
};

var fromListRow = {
  host: function(element) {
    return element
      .findElement(webdriver.By.css('td[name="host"]'))
      .then(function(hostElement) {
        return hostElement.getText();
      });
  },

  opponent: function(element) {
    return element
      .findElement(webdriver.By.css('td[name="opponent"]'))
      .then(function(opponentElement) {
        return opponentElement.getText();
      });
  },

  status: function(element) {
    return element
      .findElement(webdriver.By.css('td[name="status"] > span.label'))
      .then(function(statusElement) {
        return statusElement.getText();
      });
  }
};

Game.prototype = {
  host: null,

  opponent: null,

  status: null,

  toString: function() {
    return JSON.stringify({
      host: this.host,
      opponent: this.opponent,
      status: this.status
    });
  }
};
