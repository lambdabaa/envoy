Decks = new Meteor.Collection('decks');

Meteor.methods({
  saveDeck: function(deck) {
    if (deck._id) {
      return Decks.update({ _id: deck._id }, deck);
    }

    deck.creator = this.userId;
    return Decks.insert(deck);
  }
});
