Meteor.publish('cards', function() {
  return Cards.find({});
});

Meteor.publish('decks', function() {
  return Decks.find({ creator: this.userId });
});
