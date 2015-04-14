'use strict';

let concat = require('concat-stream');
let cuid = require('cuid');
let sendJson = require('send-data/json');
let sendError = require('./send-error');

function addRoutes (router, sessionStore, db, docIndex) {
  let restrict = require('./restrict').bind(null, sessionStore);

  router.addRoute('/api/entries', {
    POST: restrict(function (req, res) {
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
    })
  });

  router.addRoute('/api/docs/:id', {
    GET: restrict(function (req, res, opts) {
      docIndex.catchup();

      const id = opts.params.id;
      const doc = docIndex.getDoc(id);
      if (!doc) {
        res.statusCode = 404;
        return res.end('not found');
      }

      sendJson(req, res, { ok: true, doc: doc });
    })
  });
}

module.exports = addRoutes;
