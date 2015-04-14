'use strict';

let genericSession = require('generic-session');
let redirect = require('redirecter');
let sendError = require('./send-error');

function setup (router, sessionStore, config) {
  let oauth = require('./oauth')({
    clientId: config.clientId,
    secret: config.secret,
    baseUrl: config.baseUrl,
    loginUri: config.loginUri,
    callbackUri: config.callbackUri,
    scope: 'email'
  });

  router.addRoute(config.loginUri, function (req, res) {
    return oauth.login(req, res);
  });

  router.addRoute('/logout', function (req, res) {
    let session = genericSession(req, res, sessionStore);
    session.del('info', function (err) {
      if (err) { return sendError(res, err, 'session error'); }
      redirect(req, res, '/');
    });
  });

  router.addRoute(config.callbackUri, function (req, res) {
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
