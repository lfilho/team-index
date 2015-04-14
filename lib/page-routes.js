'use strict';

let genericSession = require('generic-session');

function addRoutes (router, sessionStore) {
  router.addRoute('/', function (req, res) {
    var session = genericSession(req, res, sessionStore);
    session.get('info', function (err, info) {
      var email = (info || {}).email || 'guest';
      res.end('Welcome ' + email);
    });
  });
}

module.exports = addRoutes;
