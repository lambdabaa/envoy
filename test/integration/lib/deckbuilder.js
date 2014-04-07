var Card = require('./card'),
    Q = require('q'),
    view = require('./view'),
    webdriver = require('selenium-webdriver');

function DeckBuilder() {
}
module.exports = DeckBuilder;

DeckBuilder.prototype = {
  launch: function() {
    return view.launch('/decks/new', '#deckbuilder');
  },

  /**
   * Read the deck name.
   */
  getName: function() {
    return driver
      .findElement(webdriver.By.css('#control-panel .deck-name'))
      .getText();
  },

  /**
   * Rename the deck.
   */
  setName: function(value) {
    // Click the deckname.
    return driver
      .findElement(webdriver.By.css('#control-panel .deck-name'))
      .click()
      .then(function() {
        // Wait for the name input and save button to be displayed.
        return driver.wait(function() {
          var inputDisplayed = driver
            .findElement(webdriver.By.css('#rename .deckname-input'))
            .isDisplayed();
          var saveDisplayed = driver
            .findElement(webdriver.By.css('#rename .deckname-save'))
            .isDisplayed();
          return Q.all([inputDisplayed, saveDisplayed]);
        });
      })
      .then(function() {
        // Clear the input.
        return driver
          .findElement(webdriver.By.css('#rename .deckname-input'))
          .clear();
      })
      .then(function() {
        // Write the new name.
        return driver
          .findElement(webdriver.By.css('#rename .deckname-input'))
          .sendKeys(value);
      })
      .then(function() {
        // Click save.
        return driver
          .findElement(webdriver.By.css('#rename .deckname-save'))
          .click();
      });
  },

  /**
   * Load a deck by name.
   */
  load: function(name) {
    return driver
      .findElement(webdriver.By.css('#control-panel .load-deck'))
      .click()
      .then(function() {
        return driver.wait(function() {
          return driver
            .findElement(webdriver.By.css('#load .deck-selector'))
            .isDisplayed();
        });
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css('#load input[value="' + name  + '"]'))
          .click();
      })
      .then(function() {
        // Click load.
        driver
          .findElement(webdriver.By.css('#load button[type="submit"]'))
          .click();
      });
  },

  /**
   * Save the current draft.
   */
  save: function() {
    return driver
      .findElement(webdriver.By.css('#control-panel .save-deck'))
      .then(function(element) {
        return driver.wait(function() {
          return element.isEnabled();
        });
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css('#control-panel .save-deck'))
          .then(function(element) {
            return element.isDisplayed();
          });
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css('#control-panel .save-deck'))
          .click();
      });
  },

  /**
   * Discard the current draft.
   */
  discard: function() {
    return driver
      .findElement(webdriver.By.css('#control-panel .trash-deck'))
      .then(function(element) {
        return element.isDisplayed();
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css('#control-panel .trash-deck'))
          .click();
      })
      .then(function() {
        return driver
          .switchTo()
          .alert()
          .accept();
      });
  },

  /**
   * Toggle a cardpool filter by name and value.
   */
  toggleFilter: function(name, value) {
    return driver
      .findElement(webdriver.By.css('label[data-filter="' + value + '"]'))
      .click();
  },

  /**
   * Set search text.
   */
  search: function(input) {
    return driver
      .findElement(webdriver.By.css('#search-filter'))
      .sendKeys(input);
  },

  /**
   * Get all the cards in the cardpool.
   */
  cardpool: function() {
    return driver
      .findElements(webdriver.By.css('#cardpool .card'))
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
      .findElements(webdriver.By.css('.deck-entry'))
      .then(function(elements) {
        return Q.all(elements.map(Card.fromDeck));
      });
  },

  /**
   * Options:
   *   (String) name deck name.
   */
  createDeck: function(options) {
    var self = this;
    return self.cardpool()
      .then(function(cards) {
        var target = cards[0];
        return target.click();
      })
      .then(function() {
        return self.setName(options.name || 'test');
      });
  }
};
