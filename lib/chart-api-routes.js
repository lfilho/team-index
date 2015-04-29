'use strict';

let sendJson = require('send-data/json');
let sendError = require('./send-error');

function addRoutes (router, sessionStore, rpc) {
  let restrict = require('./restrict').bind(null, sessionStore);

  router.addRoute('/api/charts/team-size', {
    GET: restrict(function (req, res, opts) {
     var to = Date.now();
     var from = to - (1000 * 3600 * 24 * 61);

      rpc.timeline.getDataPoints(from, to, function (err, points) {
        sendJson(req, res, points);
      });
    })
  });
}

module.exports = addRoutes;
