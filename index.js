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

  // - set up the docindex and default wiki page
  require('./lib/setup-home-doc')(config.homeDocId, docIndex, rpc);

  // - setup the session storage
  const sessions = require('level-session')({
    location: config.sessionDbFile
  });

  // - setup http server & routes
  const httpServer = require('./lib/http-server')();
  const router = httpServer.router;

  require('./routes/static')(router, config.staticFiles);
  require('./routes/auth')(router, sessions, config.auth);
  require('./routes/page')(router, sessions);
  require('./routes/data-api')(router, sessions, rpc);
  require('./routes/chart-api')(router, sessions, rpc);

  // - start the http server
  httpServer.listen(config.port);
  console.log('ready on http://localhost:%d', config.port);

  // - start the repl (if enabled)
  if (config.useRepl) {
    const r = require('./lib/start-repl');
    r.context.rpc = rpc;
    r.context.app = {
      indexRegistry: indexRegistry,
      sessions: sessions
    };
    r.on('exit', function () {
      httpServer.close();
    });
  }
});
