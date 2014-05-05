Template.card.id = function(card) {
  return card.id;
};

Template.card.formatCardtype = function(cardtype) {
  if (!cardtype.secondary) {
    return cardtype.primary;
  }

  return cardtype.primary + ' - ' + cardtype.secondary;
};

/**
 * Takes a card's power and hp and returns a string like
 * 3 / 3, ? / ?, ? / 5, etc.
 * ? is a placeholder for a dynamic value that will,
 * in the future, be given by the dependent game state.
 */
Template.card.formatCombat = function(power, hp) {
  if (!_.isNumber(power)) {
    power = '?';
  }
  if (!_.isNumber(hp)) {
    hp = '?';
  }

  return power + ' / ' + hp;
};

Template.card.formatDescription = function(description) {
  return description.join(' ');
};

Template.card.isZeroColor = function(cost) {
  return !cost.color || cost.color === 0;
};

Template.card.isZeroColorless = function(cost) {
  return !cost.colorless || cost.colorless === 0;
};

Template.card.isNotEnvoy = function(card) {
  return card.cardtype.primary !== 'Envoy';
};
