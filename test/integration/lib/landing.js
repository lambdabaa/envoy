var view = require('./view');

function Landing() {
}
module.exports = Landing;

Landing.prototype = {
  launch: function() {
    return view.launch('/', '#landing');
  }
};
