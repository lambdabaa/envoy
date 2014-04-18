/* global Decks */

Template.decks.decks = function() {
  return Decks.find();
};

Template.decks.cardCount = function(deck) {
  return deck.list
    .map(function(entry) {
      return entry.count;
    })
    .reduce(function(a, b) {
      return a + b;
    }, 0);
};

Template.decks.colors = function(deck) {
  var colors = deck.list
    .map(function(entry) {
      return entry.card.color;
    })
    .reduce(function(a, b) {
      var result = EJSON.clone(a);
      result[b] = true;
      return result;
    }, {});
  return Object.keys(colors)
    .map(function(color) {
      return color[0].toUpperCase();
    })
    .sort()
    .join(',');
};
