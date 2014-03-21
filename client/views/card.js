Template.card.formatCombat = function(power, hp) {
  power = power || '?';
  hp = hp || '?';
  return power + ' / ' + hp;
};

Template.card.formatDescription = function(description) {
  return description.join(' ');
};
