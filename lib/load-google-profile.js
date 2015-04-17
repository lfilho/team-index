'use strict';

let request = require('request');
let qs = require('querystring');

function loadUserProfile (accessToken, cb) {
  let url = 'https://www.googleapis.com/oauth2/v2/userinfo?' + qs.stringify({
    access_token: accessToken
  });

  request.get(url, function (err, response, body) {
    if (err) { return cb(err); }

    let profile;
    try {
      profile = JSON.parse(body);
    }
    catch (e) {
      return cb(new Error('invalid body in userinfo'));
    }

    cb(null, profile);
  });
}

module.exports = loadUserProfile;
