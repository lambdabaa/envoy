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

  getAll: function() {
    return driver
      .findElements(webdriver.By.css('.game'))
      .then(function(elements) {
        return Q.all(elements.map(Game.fromListRow));
      });
  }
};
