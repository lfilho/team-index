'use strict';

let concat = require('concat-stream');
let sendJson = require('send-data/json');
let sendError = require('../lib/send-error');
let addEntry = require('../lib/add-entry');

function addRoutes (router, sessions, rpc) {
  let restrict = require('../lib/restrict').bind(null, sessions);

  router.addRoute('/api/entries', {
    POST: restrict(function (req, res) {
      req.pipe(concat(function (raw) {
        let data;
        try {
          data = JSON.parse(raw);
        }
        catch (err) {
          return sendError(res, err, 'invalid json');
        }

        rpc.entries.add(data, function (err) {
          if (err) { return sendError(res, err); }

          res.end('ok');
        });
      }));
    })
  });

  router.addRoute('/api/docs/:id', {
    GET: restrict(function (req, res, opts) {
      rpc.docs.get(opts.params.id, function (err, doc) {
        if (err) { return sendError(res, err); }

        sendJson(req, res, { ok: true, doc: doc });
      });
    })
  });

  router.addRoute('/api/teams/:teamId', {
    GET: restrict(function (req, res, opts) {
      rpc.teams.get(opts.params.teamId, function (err, team) {
        if (err) { return sendError(res, err); }

        sendJson(req, res, team);
      });
    })
  });

  router.addRoute('/api/team-memberships-by-person/:personId', {
    GET: restrict(function (req, res, opts) {
      rpc.teams.getMembershipsByPerson(opts.params.personId, function (err, data) {
        if (err) { return sendError(res, err); }

        sendJson(req, res, data);
      });
    })
  });
}

module.exports = addRoutes;
