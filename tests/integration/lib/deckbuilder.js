var Card = require('./card'),
    Q = require('q'),
    selector = require('./deckbuilder_selector'),
    webdriver = require('selenium-webdriver');

function DeckBuilder() {
}
module.exports = DeckBuilder;

DeckBuilder.prototype = {
  launch: function() {
    var url = ENVOY_BASE_PATH + '/decks/edit';
    driver.get(url);
  },

  /**
   * Read the deck name.
   */
  getName: function() {
    return driver
      .findElement(webdriver.By.css(selector.deckname.read))
      .getText();
  },

  /**
   * Rename the deck.
   */
  setName: function(value) {
    // Click the deckname.
    return driver
      .findElement(webdriver.By.css(selector.deckname.read))
      .click()
      .then(function() {
        // Wait for the name input to be displayed.
        return driver.wait(function() {
          return driver
            .findElement(webdriver.By.css(selector.deckname.write))
            .isDisplayed();
        });
      })
      .then(function() {
        // Clear the input.
        return driver
          .findElement(webdriver.By.css(selector.deckname.write))
          .clear();
      })
      .then(function() {
        // Write the new name.
        return driver
          .findElement(webdriver.By.css(selector.deckname.write))
          .sendKeys(value);
      })
      .then(function() {
        // Click save.
        return driver
          .findElement(webdriver.By.css(selector.deckname.save))
          .click();
      });
  },

  /**
   * Load a deck by name.
   */
  load: function(name) {
    // TODO(gareth)
  },

  /**
   * Save the current draft.
   */
  save: function() {
    return driver
      .findElement(webdriver.By.css(selector.deck.save))
      .click();
  },

  /**
   * Discard the current draft.
   */
  discard: function() {
    return driver
      .findElement(webdriver.By.css(selector.deck.discard))
      .click()
      .then(function() {
        var alert = new webdriver.Alert(
          driver, 'Are you sure you want to delete this deck?');
        return alert.accept();
      });
  },

  /**
   * Toggle a cardpool filter by name and value.
   */
  toggleFilter: function(name, value) {
    return driver
      .findElement(webdriver.By.className('label-' + value))
      .click();
  },

  /**
   * Set search text.
   */
  search: function(input) {
    return driver
      .findElement(webdriver.By.css(selector.controlPanel.search))
      .sendKeys(input);
  },

  /**
   * Get all the cards in the cardpool.
   */
  cardpool: function() {
    return driver
      .findElements(webdriver.By.css(selector.cardpool.card))
      .then(function(elements) {
        // Create a card for each element.
        return Q.all(elements.map(Card.fromCardpool));
      });
  },

  /**
   * Return a representation of the deck in progress.
   */
  deck: function() {
    return driver
      .findElements(webdriver.By.css(selector.deck.card))
      .then(function(elements) {
        return Q.all(elements.map(Card.fromDeck));
      });
  }
};
