describe('card', function() {
  var subject;

  before(function() {
    subject = Template.card;
  });

  describe('#formatCardtype', function() {
    it('should return primary if no secondary', function() {
      assert.equal(subject.formatCardtype({
        primary: 'Envoy'
      }), 'Envoy');
    });

    it('should return compound type if secondary', function() {
      assert.equal(subject.formatCardtype({
        primary: 'Envoy',
        secondary: 'Poodle'
      }), 'Envoy - Poodle');
    });
  });

  describe('#formatCombat', function() {
    it('should give the right format if both power and hp', function() {
      assert.equal(subject.formatCombat(2, 2), '2 / 2');
    });

    it('should replace missing with ?', function() {
      assert.equal(subject.formatCombat(null, 2), '? / 2');
    });
  });

  describe('#formatDescription', function() {
    it('should join description blocks', function() {
      assert.equal(subject.formatDescription([
        'This statement is false.',
        'Doge'
      ]), 'This statement is false. Doge');
    });
  });

  describe('#isZeroColor', function() {
    it('should be true if zero color', function() {
      assert.ok(subject.isZeroColor({ color: 0 }));
    });

    it('should be false if three color', function() {
      assert.notOk(subject.isZeroColor({ color: 3 }));
    });
  });

  describe('#isNotEnvoy', function() {
    it('should be true if Spell', function() {
      assert.ok(subject.isNotEnvoy({ cardtype: { primary: 'Spell' } }));
    });

    it('should be false if Envoy', function() {
      assert.notOk(subject.isNotEnvoy({ cardtype: { primary: 'Envoy' } }));
    });
  });
});
