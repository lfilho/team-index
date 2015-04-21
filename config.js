'use strict';

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

    For development you can create your own clienID and secret here: https://console.developers.google.com/project

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

module.exports = config;
