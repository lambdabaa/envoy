var Landing = require('./landing'),
    webdriver = require('selenium-webdriver');

function Login() {
}
module.exports = Login;

Login.prototype = {
  configure: function() {
    // Click the login link.
    return driver
      .findElement(webdriver.By.css('#login-sign-in-link'))
      .click()
      .then(function() {
        // Wait for the accounts dialog to pop up.
        return driver.wait(function() {
          return driver
            .findElement(webdriver.By.css('.accounts-dialog'))
            .isDisplayed();
        });
      })
      .then(function() {
        // Click on the facebook button.
        return driver
          .findElement(webdriver.By.css('#login-buttons-facebook'))
          .click();
      })
      .then(function() {
        return driver.wait(function() {
          // Wait for the login configuration dialog to pop up.
          return driver
            .findElement(webdriver.By.css('#configure-login-service-dialog'))
            .isDisplayed();
        });
      })
      // Fill in and submit the service configuration form.
      .then(function() {
        return driver
          .findElement(webdriver.By.css(
            '#configure-login-service-dialog-appId'))
          .sendKeys(APP_ID);
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css(
            '#configure-login-service-dialog-secret'))
          .sendKeys(APP_SECRET);
      })
      .then(function() {
        // Wait for the save button to become enabled.
        return driver.wait(function() {
          return driver
            .findElement(webdriver.By.css(
              '#configure-login-service-dialog-save-configuration'))
            .getAttribute('className')
            .then(function(className) {
              return className.indexOf('login-button-disabled') === -1;
            });
        });
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css(
            '#configure-login-service-dialog-save-configuration'))
          .click();
      });
  },

  /**
   * Whether or not facebook has been configured.
   */
  isConfigured: function() {
    // Click on the login link.
    return driver
      .findElement(webdriver.By.css('#login-sign-in-link'))
      .click()
      .then(function() {
        return driver.wait(function() {
          // Wait for the accounts dialog to pop up.
          return driver
            .findElement(webdriver.By.css('.accounts-dialog'))
            .isDisplayed();
        });
      })
      .then(function() {
        // Check whether the button says "Sign in with Facebook".
        return driver
          .findElement(webdriver.By.css('#login-buttons-facebook'))
          .then(function(loginButton) {
            return loginButton
              .getText()
              .then(function(text) {
                return text === 'Sign in with Facebook';
              });
          });
      });
  },

  /**
   * Sign in with Facebook.
   */
  authorize: function(user) {
    // Go to facebook and log in.
    driver
      .get('https://facebook.com')
      .then(function() {
        return driver
          .findElement(webdriver.By.css('#email'))
          .sendKeys(user.email);
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css('#pass'))
          .sendKeys(user.pass);
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css('#loginbutton'))
          .click();
      })
      .then(function() {
        return driver.wait(function() {
          return driver
            .findElement(webdriver.By.css('body'))
            .getInnerHtml()
            .then(function(html) {
              return html.indexOf(user.name) !== -1;
            });
        });
      })
      .then(function() {
        // Go back to our app.
        var landing = new Landing();
        return landing.launch();
      })
      .then(function() {
        return driver
          .findElement(webdriver.By.css('#login-sign-in-link'))
          .click();
      })
      .then(function() {
        return driver.wait(function() {
          return driver
            .findElement(webdriver.By.css('.accounts-dialog'))
            .isDisplayed();
        });
      })
      .then(function() {
        // Click the facebook login button.
        return driver
          .findElement(webdriver.By.css('#login-buttons-facebook'))
          .click();
      })
      .then(function() {
        // Wait for a username to show up in the login area.
        return driver.wait(function() {
          return driver.isElementPresent(webdriver.By.css('#login-name-link'));
        });
      });
  }
};
