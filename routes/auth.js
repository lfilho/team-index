'use strict';

let redirect = require('redirecter');
let loadGoogleProfile = require('../lib/load-google-profile');
let sendError = require('../lib/send-error');

function isEmailWhitelisted(loginEmail) {
  const EMAIL_WHITELIST = require('../config').emailWhitelist;

  return EMAIL_WHITELIST.indexOf(loginEmail) !== -1;
}

function setup (router, sessions, config) {
  let oauth = require('../lib/oauth')({
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
    sessions(req, res, function () {
      req.session.del('info', function (err) {
        if (err) { return sendError(res, err, 'session error'); }
        redirect(req, res, '/');
      });
    });
  });

  router.addRoute(config.callbackUri, function (req, res) {
    sessions(req, res, function () {
      const session = req.session;

      oauth.handleCallback(req, function (err, data, decoded) {
        if (err) { return sendError(res, err, 'oauth error'); }

        if (!isEmailWhitelisted(decoded.email)) {
          let err = new Error('Access not allowed to ' + decoded.email);
          err.statusCode = 403;
          return sendError(res, err);
        }

        loadGoogleProfile(data.access_token, function (err, profile) {
          if (err) { return sendError(res, err, 'loadUserProfile error'); }

          let info = {
            email: decoded.email,
            refresh: data.refresh_token,
            name: profile.name,
            picture: profile.picture
          };

          session.set('info', info, function (err) {
            if (err) { return sendError(res, err, 'session error'); }

            redirect(req, res, '/');
          });
        });
      });
    });
  });
}

module.exports = setup;
