/**
 * Bind polyfill borrowed from
 * /docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
 * since bind is missing https://github.com/ariya/phantomjs/issues/10522
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(
            this instanceof fNOP && oThis ? this : oThis,
            aArgs.concat(Array.prototype.slice.call(arguments))
          );
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
