'use strict';

let genericSession = require('generic-session');
let redirect = require('redirecter');
let oauth = require('./oauth')({
  clientId: process.env.GOOGLE_CLIENT,
  secret: process.env.GOOGLE_SECRET,
  baseUrl: process.env.BASE_URL,
  loginUri: '/login',
  callbackUri: '/oauth2callback',
  scope: 'email'
});
let sendError = require('./send-error');

function setup (router, sessionStore) {
  router.addRoute('/login', function (req, res) {
    return oauth.login(req, res);
  });

  router.addRoute('/logout', function (req, res) {
    let session = genericSession(req, res, sessionStore);
    session.del('info', function (err) {
      if (err) { return sendError(res, err, 'session error'); }
      redirect(req, res, '/');
    });
  });

  router.addRoute('/oauth2callback', function (req, res) {
    let session = genericSession(req, res, sessionStore);

    oauth.handleCallback(req, function (err, data, decoded) {
      if (err) { return sendError(res, err, 'oauth error'); }

      let info = {
        email: decoded.email,
        refresh: data.refresh_token
      };

      session.set('info', info, function (err) {
        if (err) { return sendError(res, err, 'session error'); }

        redirect(req, res, '/');
      });
    });
  });
}

module.exports = setup;
