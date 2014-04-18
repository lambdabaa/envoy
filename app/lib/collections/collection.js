/* global Cards, Decks, Games */

Meteor.methods({
  // Test-only method to reset the database.
  removeAll: function(callback) {
    var collections = [
      Cards,
      Decks,
      Games,
      Meteor.users
    ];

    var count = collections.length;
    collections.forEach(function(collection) {
      collection.remove({}, function() {
        count -= 1;
        if (count === 0) {
          return callback && callback();
        }
      });
    });
  }
});
