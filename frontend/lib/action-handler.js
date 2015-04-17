var assign = require('object-assign');
var xhr = require('xhr');

function ActionHandler (data) {
  this._data = data;
}

ActionHandler.prototype.onAction = function (type, args, cb) {
  var data = this._data;

  if (!cb) { return; }

  if (type === 'login') {
    // redirect to the login page for google auth
    location.href = '/login';
    return;
  }

  if (type === 'logout') {
    // logout and update page state
    xhr({
      uri: '/logout',
    }, function (err, resp, body) {
      if (err) { return cb(err); }
      if (resp.statusCode !== 200) { return cb(new Error('logout failed')); }

      return cb(null, assign(data.auth, {
        name: null,
        picture: null
      }));
    });
    return;
  }
};

module.exports = function (data) {
  return new ActionHandler(data);
};
