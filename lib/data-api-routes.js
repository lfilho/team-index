'use strict';

let concat = require('concat-stream');
let cuid = require('cuid');
let sendJson = require('send-data/json');
let sendError = require('./send-error');

function addRoutes (router, sessionStore, db, docIndex) {
  router.addRoute('/api/entries', function (req, res, matches) {
    if (req.method === 'POST') {
      req.pipe(concat(function (raw) {
        let data;
        try {
          data = JSON.parse(raw);
        }
        catch (e) {
          return sendError(e, 'invalid json');
        }

        const key = cuid();
        db.put(key, data, function (err) {
          if (err) { return sendError(err, 'db error'); }

          res.end('ok');
        });
      }));
    }
    else {
      res.statusCode = 405;
      res.end();
    }
  });

  router.addRoute('/api/docs/:id', function (req, res, matches) {
    if (req.method === 'GET') {
      docIndex.catchup();

      const id = matches.params.id;
      const doc = docIndex.getDoc(id);
      if (!doc) {
        res.statusCode = 404;
        return res.end('not found');
      }

      sendJson(req, res, { ok: true, doc: doc });
    }
    else {
      res.statusCode = 405;
      res.end();
    }
  });
}

module.exports = addRoutes;
