'use strict';

let sendJson = require('send-data/json');
let sendError = require('../lib/send-error');
let querystring = require('querystring');

function addRoutes (router, sessionStore, rpc) {
  let restrict = require('../lib/restrict').bind(null, sessionStore);

  router.addRoute('/api/charts/team-size', {
    GET: restrict(function (req, res, opts) {
      const TWO_MONTHS = 1000 * 3600 * 24 * 61;
      let query = querystring.parse(opts.parsedUrl.query);

      let to = Number(query.to) || Date.now();
      let from = Number(query.from) || to - TWO_MONTHS;

      rpc.timeline.getDataPoints(from, to, function (err, points) {
        sendJson(req, res, points);
      });
    })
  });
}

module.exports = addRoutes;
