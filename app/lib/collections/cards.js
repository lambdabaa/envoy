/* global Cards: true */
/* global Card */

Cards = new Meteor.Collection('cards', {
  transform: function(doc) {
    return new Card(doc);
  }
});
