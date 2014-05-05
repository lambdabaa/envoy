var Q = require('q'),
    webdriver = require('selenium-webdriver');

function Popover() {
}
module.exports = Popover;

Popover.prototype = {
  id: null,

  actions: null,

  click: function(action) {
    return driver
      .findElement(webdriver.By.id(this.id))
      .then(function(element) {
        return element
          .findElement(
            webdriver.By.css('.card-action[data-action="' + action + '"]'))
          .then(function(action) {
            return action.click();
          });
      });
  }
};

Popover.fromElement = function(element) {
  if (!element) {
    return null;
  }

  return Q
    .all([
      element.getAttribute('id'),
      element.findElements(webdriver.By.className('card-action'))
    ])
    .spread(function(id, actionLinks) {
      var popover = new Popover();
      popover.id = id;
      return Q
        .all(
          actionLinks.map(function(actionLink) {
            return Q
              .all([
                actionLink.getAttribute('className'),
                actionLink.getAttribute('data-action'),
                actionLink.getAttribute('data-id')
              ])
              .spread(function(className, action, id) {
                return {
                  className: className,
                  action: action,
                  id: id
                };
              });
          })
        )
        .then(function(actions) {
          popover.actions = actions;
          return popover;
        });
    });
};
