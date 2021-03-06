'use strict';

/*

Config
====

*/
const path = require('path');

require('dotenv').load({
  path: path.join(__dirname, '.env')
});

const config = {
  port: process.env.PORT || 8000,
  dataDbFile: './.db',

  sessions: {
    dbFile: './.sessions',
    ttl: (60 * 60 * 24 * 7 * 1000) // 1 week
  },

  emailWhitelist: require('./.email-whitelist.json'),

  /*

    Authentication
    ----

    The environment variables configuration needed for auth are are described in [./env.example](./.env.example) file.

  */
  auth: {
    clientId: process.env.GOOGLE_CLIENT,
    secret: process.env.GOOGLE_SECRET,
    baseUrl: process.env.BASE_URL,
    loginUri: '/login',
    callbackUri: '/oauth2callback'
  },

  /*

    Static files
    ----

    Static file caching is disabled outside of production to make debugging easier.

  */
  staticFiles: {
    dir: path.join(__dirname, 'static'),
    cacheEnabled: (process.env.NODE_ENV === 'production')
  },

  /*

    Repl
    ----

    A repl can be enabled, useful for development.

  */
  useRepl: !!process.env.REPL,

  /*

    Wiki
    ----

  */
  homeDocId: 'welcome'
};

module.exports = config;
