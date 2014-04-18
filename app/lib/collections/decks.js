/* global Decks: true */

/**
 * (String) creator userId of deck owner.
 * (Array) list cards in deck.
 * (String) name title of deck.
 */
Decks = new Meteor.Collection('decks');

Meteor.methods({
  /**
   * Options:
   *   (Array) list cards in deck.
   *   (String) name title of deck.
   */
  saveDeck: function(options) {
    if (options._id) {
      return Decks.update({ _id: options._id }, options);
    }

    var deck = {};
    deck.creator = this.userId;
    deck.list = options.list;
    deck.name = options.name;
    Decks.insert(deck);
  }
});
