'use strict';

let genericSession = require('generic-session');

function restrict (sessionStore, handler) {
  return function (req, res, opts, cb) {
    var session = genericSession(req, res, sessionStore);
    session.get('info', function (err, info) {
      if (err) { return cb(err); }

      if (!info) {
        let err = new Error('Unauthorized');
        err.statusCode = 403;
        return cb(err);
      }

      handler(req, res, opts, cb);
    });
  };
}

module.exports = restrict;
