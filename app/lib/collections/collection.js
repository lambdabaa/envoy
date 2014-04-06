Meteor.methods({
  // Test-only method to reset the database.
  removeAll: function(callback) {
    Cards.remove({}, function() {
      Decks.remove({}, function() {
        Meteor.users.remove({}, function() {
          callback();
        });
      });
    });
  }
});
