Template.deckbuilder.created = function() {
  Session.set('deck', {
    'list': [],
    'name': null
  });

  Session.set('filters', {
    color: {
      black: false,
      blue: false,
      green: false,
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
  return deck.list.length === 0;
};

Template.deckbuilder.cardpool = function() {
  var cards = Cards.find().fetch();
  var filters = Session.get('filters');
  return array.multireject(cards, [
    function(card) {
      var color = card.color;
      return filters.color[color];
    },

    function(card) {
      var cardtype = card.primaryType.toLowerCase();
      return filters.cardtype[cardtype];
    },

    function(card) {
      var cardname = card.name.toLowerCase();
      var search = filters.search.toLowerCase();
      return search.length >= 3 && cardname.indexOf(search) === -1;
    }
  ]);
};

Template.deckbuilder.deck = function() {
  var deck = Session.get('deck');
  return deck.list.map(function(record) {
    record.card.count = record.count;
    return record.card;
  });
};

Template.deckbuilder.deckname = function() {
  var deck = Session.get('deck');
  return deck.name || 'Untitled';
};

Template.deckbuilder.formatCost = function(card) {
  var colorless = card.cost.colorless ?
    card.cost.colorless.toString() : '';
  var colorCount = +card.cost.color;
  var color;
  switch (card.color) {
    case 'black':
      color = 'B';
      break;
    case 'blue':
      color = 'U';
      break;
    case 'green':
      color = 'G';
      break;
    case 'red':
      color = 'R';
      break;
    case 'white':
      color = 'W';
      break;
  }

  return colorless + new Array(colorCount + 1).join(color);
};

Template.deckbuilder.events({
  'click .deckload': function() {
    var checked = document.querySelector('.deck-selector > input:checked');
    var deck = Decks.findOne({ name: checked.value });
    Session.set('deck', deck);
  },

  'click .deckname-save': function() {
    var input = document.getElementsByClassName('deckname-input')[0];
    var deck = Session.get('deck');
    deck.name = input.value;
    Session.set('deck', deck);
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

    Meteor.call('saveDeck', deck, {
    }, function(err, result) {
      console.log('result = ' + result);
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
    var index = array.find(list, function(record) {
      return _.isEqual(record.card, this);
    }, this);

    if (index !== -1) {
      var count = list[index].count + 1;
      list[index].count = Math.min(4, count);
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

    var count = this.count;
    delete this.count;
    var index = array.find(list, function(record) {
      return _.isEqual(record.card, this);
    }, this);

    var record = list[index];
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
  'click label': function() {
    // Hack: We have to let the checkboxes get checked. This happens
    //     synchronously but after this gets called,
    //     so let the event loop spin before recomputing filters.
    setTimeout(setFilters, 0);
  },

  /**
   * When the user types into the search box, recompute the applied filters.
   */
  'input #search-filter': function() {
    // Hack: We have to let the checkboxes get checked. This happens
    //     synchronously but after this gets called,
    //     so let the event loop spin before recomputing filters.
    setTimeout(setFilters, 0);
  }
});

/**
 * Update the filters to match the DOM.
 */
function setFilters() {
  var filters = { color: {}, cardtype: {}, search: '' };

  var inputs = document.querySelectorAll('#control-panel input[type="checkbox"]');
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    filters[input.name][input.value] = input.checked;
  }

  var search = document.getElementById('search-filter');
  filters.search = search.value || '';

  Session.set('filters', filters);
}
