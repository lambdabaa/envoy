var webdriver = require('selenium-webdriver');

var view = {
  launch: function(path, selector) {
    var url = ENVOY_BASE_PATH + path;
    return driver
      .get(url)
      .then(function() {
        return view.waitUntilLoaded(selector);
      });
  },

  waitUntilLoaded: function(selector) {
    return driver.wait(function() {
      return driver.isElementPresent(webdriver.By.css(selector));
    });
  }
};
module.exports = view;
