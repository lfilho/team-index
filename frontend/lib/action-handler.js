var assign = require('object-assign');

function ActionHandler (data) {
  this._data = data;
}


ActionHandler.prototype.onAction = function (type, args, cb) {
  var self = this;
  var data = this._data;

  if (!cb) { return; }

  // fake auth stuff
  setTimeout(function () {
    if (type === 'login') {
      return cb(null, assign(data.auth, { userEmail: 'josh@x-team.com' }));
    }

    if (type === 'logout') {
      return cb(null, assign(data.auth, { userEmail: null }));
    }
  }, 1000);
};

module.exports = function (data) {
  return new ActionHandler(data);
};
