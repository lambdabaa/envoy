Decks = new Meteor.Collection('decks');

Decks.allow({
  insert: function() {
    return false;
  },

  update: function() {
    return false;
  },

  remove: function() {
    return true;
  }
});

Meteor.methods({
  saveDeck: function(deck) {
    if (deck._id) {
      return Decks.update({ _id: deck._id }, deck);
    }

    deck.creator = this.userId;
    return Decks.insert(deck);
  }
});
