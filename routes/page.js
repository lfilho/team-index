'use strict';

let h = require('hyperscript');
let pageTemplate = require('../lib/page-template');

function addRoutes (router, sessions) {
  router.addRoute('/', function (req, res) {
    sessions(req, res, function () {
      const session = req.session;

      session.get('info', function (err, info) {
        if (err) { console.log(err); }

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
  });
}

module.exports = addRoutes;
