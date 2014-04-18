/* global Decks, Games */

Meteor.startup(function() {
  Router.configure({
    layoutTemplate: 'layout'
  });

  Router.map(function() {
    this.route('landing', { path: '/', template: 'landing' });

    this.route('Decks#index', {
      path: '/decks',
      template: 'decks',
      action: function() {
        return this.ready() && this.render();
      },
      waitOn: function() {
        return Meteor.subscribe('decks');
      }
    });

    this.route('Decks#new', {
      path: '/decks/new',
      template: 'deckbuilder',
      action: function() {
        if (!this.ready()) {
          return;
        }

        Session.set('deckbuilder.deck', { 'list': [], 'name': null });
        return this.render();
      },
      waitOn: function() {
        return [
          Meteor.subscribe('cards'),
          Meteor.subscribe('decks')  // Wait for decks for "load" functionality.
        ];
      }
    });

    this.route('Decks#show', {
      path: '/decks/:name',
      template: 'deckbuilder',
      action: function() {
        if (!this.ready()) {
          return;
        }

        var deck = Decks.findOne({ name: this.params.name });
        Session.set('deckbuilder.deck', deck);
        return this.render();
      },
      waitOn: function() {
        return [
          Meteor.subscribe('cards'),
          Meteor.subscribe('decks')  // Wait for decks for "load" functionality.
        ];
      }
    });

    this.route('Games#index', {
      path: '/games',
      template: 'games',
      action: function() {
        return this.ready() && this.render();
      },
      waitOn: function() {
        return [
          Meteor.subscribe('decks'),
          Meteor.subscribe('games'),
          Meteor.subscribe('users')
        ];
      }
    });

    this.route('Games#show', {
      path: '/games/:id',
      template: 'game',
      action: function() {
        if (!this.ready()) {
          return;
        }

        var game = Games.findOne({ _id: this.params.id });
        Session.set('game.game', game);
        return this.render();
      },
      waitOn: function() {
        return [
          Meteor.subscribe('games'),
          Meteor.subscribe('users')
        ];
      }
    });
  });
});
