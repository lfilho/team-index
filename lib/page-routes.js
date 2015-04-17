'use strict';

let h = require('hyperscript');
let genericSession = require('generic-session');
let pageTemplate = require('./page-template');

function addRoutes (router, sessionStore) {
  router.addRoute('/', function (req, res) {
    let session = genericSession(req, res, sessionStore);
    session.get('info', function (err, info) {
      info = info || {};
      let homeTemplate = pageTemplate([
        h('#app'),

        // Set [[ Session global ]] so that client js and access info about the session.
        h('script', 'window.authState=' + JSON.stringify({ userEmail: info.email }))
      ]);
      res.end('<!doctype html>\n' + homeTemplate.outerHTML);
    });
  });
}

module.exports = addRoutes;
