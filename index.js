'use strict';

let httpServer = require('./lib/http-server')();
const config = {
  port: process.env.PORT || 8000,
  dataDbFile: './.db',
  sessionDbFile: './.sessions'
};

let setupDb = require('./lib/setup-db');
let sessionStore = require('level-session').LevelStore(config.sessionDbFile);

setupDb({ dbFile: config.dataDbFile }, function (err, db, docIndex) {
  if (err) { throw err; }

  let router = httpServer.router;

  // ----
  // routes

  require('./lib/auth-routes')(router, sessionStore);
  require('./lib/page-routes')(router, sessionStore);
  require('./lib/data-api-routes')(router, sessionStore, db, docIndex);

  // ----

  httpServer.listen(config.port);
  console.log('ready on :%d', config.port);
});
