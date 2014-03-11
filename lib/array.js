array = {
  find: function(list, filter, context) {
    var result = -1;
    list.some(function(value, index) {
      if (filter.call(context, value)) {
        result = index;
        return true;
      }
    });

    return result;
  },

  multireject: function(list, filters, context) {
    var result = list;
    for (var i = 0; i < filters.length; i++) {
      var filter = filters[i];
      result = _.reject(result, filter, context);
    }

    return result;
  }
};
