'use strict';

let h = require('hyperscript');
let genericSession = require('generic-session');
let pageTemplate = require('./page-template');

function addRoutes (router, sessionStore) {
  router.addRoute('/', function (req, res) {
    let session = genericSession(req, res, sessionStore);
    session.get('info', function (err, info) {
      let email = (info || {}).email || 'guest';
      let homeTemplate = pageTemplate([
        h('#app')
      ]);
      res.end('<!doctype html>\n' + homeTemplate.outerHTML);
    });
  });
}

module.exports = addRoutes;
