/* global array */

describe('array', function() {
  var subject;

  before(function() {
    subject = array;
  });

  describe('#multireject', function() {
    it('should reject if one filter returns true', function() {
      var result = subject.multireject([1, 2, 3], [
        function(num) {
          return num % 2 === 0;
        },
        function(num) {
          return num > 1;
        }
      ]);

      assert.deepEqual(result, [1]);
    });
  });
});
