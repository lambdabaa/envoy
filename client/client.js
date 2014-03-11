Meteor.subscribe('cards');
Meteor.subscribe('decks');

Meteor.pages({
  '/': 'landing',
  '/decks': 'decks',
  '/decks/edit': 'deckbuilder'
});
