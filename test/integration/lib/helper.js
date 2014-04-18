module.exports = {
  isPresentAndDisplayed: function(locator) {
    return driver
      .isElementPresent(locator)
      .then(function(isPresent) {
        if (!isPresent) {
          return false;
        }

        return driver
          .findElement(locator)
          .then(function(element) {
            return element.isDisplayed();
          });
      });
  }
};
