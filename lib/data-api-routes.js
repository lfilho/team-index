'use strict';

let concat = require('concat-stream');
let sendJson = require('send-data/json');
let sendError = require('./send-error');
let addEntry = require('./add-entry');
var validator = require('./util/validation');

function addRoutes (router, sessionStore, db, docIndex) {
  let restrict = require('./restrict').bind(null, sessionStore);

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

        if (!validator.isValidDbKey(data._id, data._type)) {
          let err = new Error('ID and Type can only have letters, numbers and dashes.')
          return sendError(res, err);
        }

        addEntry(db, data, function (err) {
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
