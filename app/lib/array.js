/* jshint -W117 */

array = {
  multireject: function(list, filters, context) {
    var result = list;
    for (var i = 0; i < filters.length; i += 1) {
      var filter = filters[i];
      result = _.reject(result, filter, context);
    }

    return result;
  }
};
