'use strict';

let concat = require('concat-stream');
let cuid = require('cuid');

function jsonResponse (res, data) {
  res.writeHead(res.statusCode, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(data));
}

function addRoutes (router, sessionStore, db, docIndex) {
  router.addRoute('/api/entries', function (req, res, matches) {
    if (req.method === 'POST') {
      req.pipe(concat(function (raw) {
        let data;
        try {
          data = JSON.parse(raw);
        }
        catch (e) {
          console.log(e);
          res.statusCode = 500;
          res.end('invalid json');
        }

        const key = cuid();
        db.put(key, data, function (err) {
          if (err) {
            console.error(err);
            res.statusCode = 500;
            return res.end('db error');
          }

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
      let doc = docIndex.getDoc(id);
      if (!doc) {
        res.statusCode = 404;
        return jsonResponse(res, { ok: false });
      }

      jsonResponse(res, { ok: true, doc: doc });
    }
    else {
      res.statusCode = 405;
      res.end();
    }
  });
}

module.exports = addRoutes;
