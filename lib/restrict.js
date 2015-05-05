'use strict';

function restrict (levelSession, handler) {
  if (process.env.NO_AUTH) { return handler; }

  return function (req, res, opts, cb) {
    levelSession(req, res, function () {
      const session = req.session;
      session.get('info', function (err, info) {
        if (err) { return cb(err); }

        if (!info) {
          let err = new Error('Unauthorized');
          err.statusCode = 403;
          return cb(err);
        }

        handler(req, res, opts, cb);
      });
    });
  };
}

module.exports = restrict;
