describe('array', function() {
  var subject;

  before(function() {
    subject = array;
  });

  describe('#find', function() {
    it('should return -1 if not list contains', function() {
      var index = subject.find([1, 2, 3], function(item) {
        return item < 0 || item > 3;
      });

      assert.equal(index, -1);
    });

    it('should return index if list contains', function() {
      var index = subject.find([1, 2, 3], function(item) {
        return item % 2 === 0;
      });

      assert.equal(index, 1);
    });
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
