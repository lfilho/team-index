'use strict';

let h = require('hyperscript');
let genericSession = require('generic-session');
let pageTemplate = require('../lib/page-template');

function addRoutes (router, sessionStore) {
  router.addRoute('/', function (req, res) {
    let session = genericSession(req, res, sessionStore);
    session.get('info', function (err, info) {
      info = info || {};

      let authState = {
        name: info.name || (info.email && info.email.split('@')[0]),
        picture: info.picture
      };

      let homeTemplate = pageTemplate([
        h('#app'),

        // Set [[ Session global ]] so that client js and access info about the session.
        h('script', 'window.authState=' + JSON.stringify(authState)),
        h('script', { src: 'http://code.highcharts.com/adapters/standalone-framework.js' }),
        h('script', { src: 'http://code.highcharts.com/highcharts.js' }),
        h('script', { src: 'http://code.highcharts.com/modules/exporting.js' })
      ]);
      res.end('<!doctype html>\n' + homeTemplate.outerHTML);
    });
  });
}

module.exports = addRoutes;
