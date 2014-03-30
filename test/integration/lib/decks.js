var Deck = require('./deck'),
    Q = require('q'),
    view = require('./view'),
    webdriver = require('selenium-webdriver');

function Decks() {
}
module.exports = Decks;

Decks.prototype = {
  launch: function() {
    return view.launch('/decks', '#decks');
  },

  getAll: function() {
    return driver
      .findElements(webdriver.By.css('.deck'))
      .then(function(elements) {
        return Q.all(elements.map(Deck.fromListRow));
      });
  }
};
