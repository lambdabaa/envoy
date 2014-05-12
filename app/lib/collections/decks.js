/* global Decks: true */
/* global Deck */
Decks = new Meteor.Collection('decks', {
  transform: function(doc) {
    return new Deck(doc);
  }
});

Meteor.methods({
  /**
   * Options:
   *   (Array) list cards in deck.
   *   (String) name title of deck.
   */
  saveDeck: function(options) {
    if (options instanceof Deck) {
      return Decks.update({ _id: options._id }, options.toJSONValue());
    }

    var deck = {};
    deck.creator = this.userId;
    deck.list = options.list;
    deck.name = options.name;
    Decks.insert(deck);
  }
});
