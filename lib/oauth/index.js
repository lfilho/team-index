// credits: https://www.npmjs.com/package/node-google-oauth
// TODO: rewrite into a module

var request = require('request');
var url = require('url');
var querystring = require('querystring');
var path = require('path');
var crypto = require('crypto');
var redirect = require('redirecter');
var jwt = require('jsonwebtoken');

const googleAuthEndpoint = 'https://accounts.google.com/o/oauth2/auth';
const googleTokenEndpoint = 'https://accounts.google.com/o/oauth2/token';

function getRedirectUri (opts) {
  var parts = url.parse(opts.baseUrl);
  parts.pathname = path.join(parts.pathname, opts.callbackUri);
  return url.format(parts);
}

function getLoginUrl (opts) {
  var state = crypto.randomBytes(8).toString('hex');
  var params = {
    client_id: opts.clientId,
    scope: opts.scope,
    redirect_uri: getRedirectUri(opts),
    state: state,
    response_type: 'code',
    approval_prompt: 'force',
    access_type: 'offline'
  };

  return googleAuthEndpoint + '?' + querystring.stringify(params);
}

function login (opts, req, res) {
  const loginUrl = getLoginUrl(opts);
  redirect(req, res, loginUrl);
}

function handleCallback (opts, req, cb) {
  var query = url.parse(req.url, true).query;
  var code = query.code;
  if (!code) {
    return cb(new Error('missing oauth code'));
  }

  var params = {
    form: {
      code: code,
      client_id: opts.clientId,
      client_secret: opts.secret,
      redirect_uri: getRedirectUri(opts),
      grant_type: 'authorization_code'
    }
  };

  request.post(googleTokenEndpoint, params, function (err, response, body) {
    var data;
    var decoded;
    try {
      data = JSON.parse(body);
      decoded = jwt.decode(data.id_token);
    }
    catch (e) {
      return cb(e);
    }

    cb(null, data, decoded);
  });
}

module.exports = function setupOauth (opts) {
  return {
    login: login.bind(null, opts),
    handleCallback: handleCallback.bind(null, opts)
  };
};
