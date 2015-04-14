'use strict';

let concat = require('concat-stream');
let cuid = require('cuid');
let genericSession = require('generic-session');

let httpServer = require('./lib/http-server')();
const config = {
  port: process.env.PORT || 8000,
  dataDbFile: './.db',
  sessionDbFile: './.sessions'
};

let setupDb = require('./lib/setup-db');
let sessionStore = require('level-session').LevelStore(config.sessionDbFile);

function jsonResponse (res, data) {
  res.writeHead(res.statusCode, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(data));
}

setupDb({ dbFile: config.dataDbFile }, function (err, db, docIndex) {
  if (err) { throw err; }

  let router = httpServer.router;

  // ----
  // auth routes

  require('./lib/auth-routes')(router, sessionStore);

  // ----
  // page routes

  router.addRoute('/', function (req, res) {
    var session = genericSession(req, res, sessionStore);
    session.get('info', function (err, info) {
      var email = (info || {}).email || 'guest';
      res.end('Welcome ' + email);
    });
  });

  // ----
  // data api routes

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

  // ----

  httpServer.listen(config.port);
  console.log('ready on :%d', config.port);
});
