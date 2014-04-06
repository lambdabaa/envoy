var webdriver = require('selenium-webdriver');

module.exports = {
  launch: function(path, selector) {
    var url = ENVOY_BASE_PATH + path;
    return driver
      .get(url)
      .then(function() {
        return driver.wait(function() {
          return driver.isElementPresent(webdriver.By.css(selector));
        });
      });
  }
};
