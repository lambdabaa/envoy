Meteor.subscribe('cards');
Meteor.subscribe('decks');
Meteor.subscribe('games');
Meteor.subscribe('users');

Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('landing', { path: '/', template: 'landing' });

  this.route('Decks#index', { path: '/decks', template: 'decks' });

  this.route('Decks#new', {
    path: '/decks/new',
    template: 'deckbuilder',
    before: function() {
      Session.set('deck', { 'list': [], 'name': null });
    }
  });

  this.route('Decks#show', {
    path: '/decks/:name',
    template: 'deckbuilder',
    before: function() {
      var deck = Decks.findOne({ name: this.params.name });
      Session.set('deck', deck);
    }
  });

  this.route('Games#index', { path: '/games', template: 'games' });
});
