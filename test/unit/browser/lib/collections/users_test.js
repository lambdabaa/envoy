describe('Users', function() {
  var subject;

  beforeEach(function() {
    subject = Meteor.users;
  });

  describe('#getName', function() {
    it('should return profile name', function() {
      assert.strictEqual(subject.getName('me'), 'Buddha');
    });
  });
});
