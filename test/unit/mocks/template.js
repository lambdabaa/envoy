/* jshint -W098 */
var Template = {
  card: {},

  deckbuilder: {},

  decks: {},

  game: {},

  games: {}
};

Object.keys(Template).forEach(function(name) {
  Template[name].events = function() {};
});
