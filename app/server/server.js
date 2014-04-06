Meteor.publish('cards', function() {
  return Cards.find({});
});

Meteor.publish('decks', function() {
  return Decks.find({ creator: this.userId });
});

Meteor.publish('users', function() {
  return Meteor.users.find({});
});
