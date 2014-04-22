/* jshint -W117 */

array = {
  multireject: function(list, filters, context) {
    return _.reject(list, function(value) {
      return _.some(filters, function(filter) {
        return filter(value);
      }, context);
    }, context);
  }
};
