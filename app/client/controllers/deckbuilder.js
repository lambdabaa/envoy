Template.deckbuilder.created = function() {
  // Every time we load the deckbuilder template,
  // all of the filters should initially be turned off.
  Session.set('filters', {
    color: {
      blue: false,
      green: false,
      purple: false,
      red: false,
      white: false
    },

    cardtype: {
      envoy: false,
      spell: false,
      trap: false
    },

    search: ''
  });
};

Template.deckbuilder.decks = function() {
  return Decks.find().fetch();
};

Template.deckbuilder.isClean = function() {
  var deck = Session.get('deck');
  return !deck || deck.list.length === 0;
};

Template.deckbuilder.cardpool = function() {
  var cards = Cards.find().fetch();
  var filters = Session.get('filters');
  return array.multireject(cards, [
    // Reject the card if we're filtering its color.
    function(card) {
      var color = card.color;
      return filters.color[color];
    },

    // Reject the card if we're filtering its cardtype.
    function(card) {
      var cardtype = card.cardtype.primary.toLowerCase();
      return filters.cardtype[cardtype];
    },

    // Reject the card if it doesn't match the search.
    function(card) {
      var cardname = card.name.toLowerCase();
      var search = filters.search.toLowerCase();
      return search.length >= 3 && cardname.indexOf(search) === -1;
    }
  ]);
};

Template.deckbuilder.deck = function() {
  var deck = Session.get('deck');
  if (!deck) {
    return [];
  }

  return deck.list.map(function(record) {
    var entry = EJSON.clone(record.card);
    entry.count = record.count;
    return entry;
  });
};

Template.deckbuilder.deckname = function() {
  var deck = Session.get('deck');
  if (!deck || !deck.name) {
    return 'Untitled';
  }

  return deck.name;
};

Template.deckbuilder.formatCardtype = function(card) {
  if (!card.cardtype.secondary) {
    return card.cardtype.primary;
  }

  return card.cardtype.primary + ' - ' + card.cardtype.secondary;
};

Template.deckbuilder.formatCost = function(card) {
  // Something like '1'.
  var colorless = card.cost.colorless ?
    card.cost.colorless.toString() : '';
  // Something like 'G'.
  var color = card.color[0].toUpperCase();
  // Something like '1GG'.
  return colorless + new Array(card.cost.color + 1).join(color);
};

Template.deckbuilder.events({
  'click #load button[type="submit"]': function(event, template) {
    var checked = template.find('input:checked[name="deckname"]');
    var deck = Decks.findOne({ name: checked.value });
    Router.go('Decks#show', { name: deck.name });
  },

  'click .deckname-save': function(event, template) {
    var deck = Session.get('deck');
    var input = template.find('.deckname-input');
    deck.name = input.value;
    Session.set('deck', deck);
    Meteor.call('saveDeck', deck, {}, function() {
      Router.go('Decks#show', { name: deck.name });
    });
  },

  /**
   * When the user clicks the save button,
   *  - if the deck doesn't already have a name, prompt the user to create one
   *  - else save the deck
   */
  'click .save-deck': function() {
    var deck = Session.get('deck');
    if (!deck.name) {
      return window.alert('Please give your deck a name.');
    }

    Meteor.call('saveDeck', deck, {}, function() {
      Router.go('Decks#show', { name: deck.name });
    });
  },

  /**
   * When the user clicks the trash button, delete the current deck.
   */
  'click .trash-deck': function() {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      Session.set('deck', { list: [], name: null });
    }
  },

  /**
   * When the user clicks a card, try to insert it into the deck.
   */
  'click .card': function() {
    // Check whether or not this card is already in our deck.
    var deck = Session.get('deck');
    var list = deck.list;
    var record = _.find(list, function(record) {
      return _.isEqual(record.card, this);
    }, this);

    if (record) {
      record.count = Math.min(4, record.count + 1);
    } else {
      list.push({ card: this, count: 1 });
    }

    Session.set('deck', deck);
  },

  /**
   * When the user clicks on a card in a deck,
   * remove one copy of the card from the deck.
   */
  'click .deck-entry': function() {
    var deck = Session.get('deck');
    var list = deck.list;

    var record = _.find(list, function(record) {
      return record.card.name === this.name;
    }, this);

    if (record.count === 1) {
      list = _.without(list, record);
    } else {
      record.count -= 1;
    }

    deck.list = list;
    Session.set('deck', deck);
  },

  /**
   * When the user toggles a filter, recompute the applied filters.
   */
  'click label': function(event) {
    var label = event.currentTarget;
    var input = label.childNodes[1];
    var filter = label.dataset.filter;
    var filters = Session.get('filters');
    filters[input.name][filter] = input.checked;
    Session.set('filters', filters);
  },

  /**
   * When the user types into the search box, recompute the applied filters.
   */
  'input #search-filter': function(event) {
    var filters = Session.get('filters');
    filters.search = event.currentTarget.value;
    Session.set('filters', filters);
  }
});
