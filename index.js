'use strict';

/*

Team Index
====

This module is the application entry point.

Some enviroment variables are expected as described below in [[ Config ][ Environment variables ]].

After initializing the environment, start the application with `iojs index.js`

*/

/*

Config
====

Environment variables
----

To avoid committing passwords to the repo it's recommended to create a gitignored file called `setup-env`, eg.

```
export BASE_URL=http://localhost:8000
export GOOGLE_CLIENT=...
export GOOGLE_SECRET=...
```

Then to initialize the environment run `source setup-env`.

*/
let path = require('path');
const config = {
  port: process.env.PORT || 8000,
  dataDbFile: './.db',
  sessionDbFile: './.sessions',

  /*

    Authentication
    ----

    The environment variables needed for auth are:
    - `GOOGLE_CLIENT` (clientID for google OAuth)
    - `GOOGLE_SECRET` (secret for google OAuth)
    - `BASE_URL` (base URL for the site, eg. `http://localhost:8000`)

  */
  auth: {
    clientId: process.env.GOOGLE_CLIENT,
    secret: process.env.GOOGLE_SECRET,
    baseUrl: process.env.BASE_URL,
    loginUri: '/login',
    callbackUri: '/oauth2callback',
  },

  /*

    Static files
    ----

    Static file caching is disabled outside of production to make debugging easier.

  */
  staticFiles: {
    dir: path.join(__dirname, 'static'),
    cacheEnabled: (process.env.NODE_ENV === 'production')
  }
};

/*

Startup procedure
====

*/

// - setup the database and doc index
require('./lib/setup-db')({ dbFile: config.dataDbFile }, function (err, db, docIndex) {
  if (err) { throw err; }

  // - setup the session storage
  let sessionStore = require('level-session').LevelStore(config.sessionDbFile);

  // - setup http server & routes
  let httpServer = require('./lib/http-server')();
  let router = httpServer.router;

  require('./lib/static-routes')(router, config.staticFiles);
  require('./lib/auth-routes')(router, sessionStore, config.auth);
  require('./lib/page-routes')(router, sessionStore);
  require('./lib/data-api-routes')(router, sessionStore, db, docIndex);

  // - start the http server
  httpServer.listen(config.port);
  console.log('ready on :%d', config.port);
});
