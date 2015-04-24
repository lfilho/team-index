'use strict';

/*

Config
====

*/
require('dotenv').load();
let path = require('path');
const config = {
  port: process.env.PORT || 8000,
  dataDbFile: './.db',
  sessionDbFile: './.sessions',

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
