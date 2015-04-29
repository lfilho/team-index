'use strict';

/*

Team Index
====

This module is the application entry point.

Some enviroment variables are expected as described in [[ Config ][ Environment variables ]].

After initializing the environment, start the application with `iojs index.js`

*/

const config = require('./config');

/*

Startup procedure
----

*/

// - setup the database and doc index
require('./lib/setup-db')({ dbFile: config.dataDbFile }, function (err, db, docIndex) {
  if (err) { throw err; }

  // - setup the index registry
  const indexRegistry = new Map();
  indexRegistry.set('docs', docIndex);
  indexRegistry.set('timeline', require('./lib/timeline-index')(docIndex, {
    // for teams we record events of when the team started or ended
    team: ['startedAt', 'endedAt'],

    // for team memberships we record events of when the membership started or ended
    teamMembership: ['startedAt', 'endedAt']
  }));

  // - setup the rpc module
  const rpc = require('./lib/rpc')(db, indexRegistry);

  // - setup the session storage
  let sessionStore = require('level-session').LevelStore(config.sessionDbFile);

  // - setup http server & routes
  let httpServer = require('./lib/http-server')();
  let router = httpServer.router;

  require('./lib/static-routes')(router, config.staticFiles);
  require('./lib/auth-routes')(router, sessionStore, config.auth);
  require('./lib/page-routes')(router, sessionStore);
  require('./lib/data-api-routes')(router, sessionStore, rpc);
  require('./lib/chart-api-routes')(router, sessionStore, rpc);

  // - start the http server
  httpServer.listen(config.port);
  console.log('ready on http://localhost:%d', config.port);
});
