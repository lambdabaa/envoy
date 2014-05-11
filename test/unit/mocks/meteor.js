/* jshint -W098 */
var Meteor = {
  Collection: function() {
  },

  /**
   * Noop.
   */
  call: function() {
    var callback = arguments[arguments.length - 1];
    return callback &&
           typeof callback === 'function' &&
           callback();
  },

  methods: function() {
  },

  userId: function() {
    return 'me';
  },

  users: {
    find: function(query) {
      if (typeof query !== 'object' || !('_id' in query)) {
        throw new Error('Only supports { _id: "blah" } queries');
      }

      var find = {};
      find.fetch = function() {
        var user = {};
        user.profile = {};
        switch (query._id) {
          case 'me':
            user.profile.name = 'Buddha';
            break;
          case 'them':
            user.profile.name = 'Yoda';
            break;
        }

        return [user];
      };

      return find;
    }
  },

  uuid: function() {
    return Math.random().toString(36).substr(2);
  }
};
