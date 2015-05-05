'use strict';

let sendJson = require('send-data/json');
let sendError = require('../lib/send-error');
let querystring = require('querystring');

function addRoutes (router, sessions, rpc) {
  let restrict = require('../lib/restrict').bind(null, sessions);

  router.addRoute('/api/charts/team-size', {
    GET: restrict(function (req, res, opts) {
      const ONE_MONTH = 1000 * 3600 * 24 * 30;
      const query = querystring.parse(opts.parsedUrl.query);

      const to = Number(query.to) || Date.now() + ONE_MONTH;
      const from = Number(query.from) || Date.now() - ONE_MONTH;

      rpc.timeline.getDataPoints(from, to, function (err, points) {
        if (err) { console.log(err); }
        sendJson(req, res, points);
      });
    })
  });

  router.addRoute('/api/charts/ending-contracts', {
    GET: restrict(function (req, res, opts) {
      const TWO_MONTHS = 1000 * 3600 * 24 * 61;
      const query = querystring.parse(opts.parsedUrl.query);

      // default is to show any contracts ending within the next 2 months
      const from = Date.now();
      const to = Number(query.to) || from + TWO_MONTHS;

      rpc.timeline.getEndingContracts(from, to, function (err, result) {
        if (err) { console.log(err); }
        sendJson(req, res, result);
      });
    })
  });
}

module.exports = addRoutes;
