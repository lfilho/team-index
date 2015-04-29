'use strict';

const archieml = require('archieml');
const assign = require('object-assign');
const xhr = require('xhr');

module.exports = function (stores) {
  const actions = {};

  actions.wikiLoad = function (args) {
    // don't need to load if already in memory
    if (stores.wiki.data.hasOwnProperty(args.id)) { return; }

    xhr({
      url: '/api/docs/' + args.id
    }, function (err, resp, body) {
      if (err) { return console.error(err); }

      // not found: create a placeholder
      if (resp.statusCode === 404) {
        let docs = {};
        docs[args.id] = { _id: args.id };
        stores.wiki.set(docs);
        return;
      }

      if (resp.statusCode !== 200) { return console.error('load failed', resp); }

      var data;
      try {
        data = JSON.parse(body);
      }
      catch (e) {
        return console.error('invalid body', resp);
      }

      var docs = {};
      docs[args.id] = data.doc;
      stores.wiki.set(docs);
    });
  };

  actions.wikiSave = function (args, cb) {
    cb = cb || function () {};

    var doc = assign(archieml.load(args.body), {
      _id: args.id,
      _type: args.type,
    });

    xhr({
      uri: '/api/entries',
      method: 'POST',
      json: doc
    }, function (err, resp, body) {
      if (err) { return cb(err); }
      if (resp.statusCode !== 200) { return cb(new Error('save failed')); }

      cb();
    });
  };

  actions.login = function (args) {
    location.href = '/login';
  };

  actions.logout = function () {
    xhr({
      uri: '/logout',
    }, function (err, resp, body) {
      if (err) { return console.error(err); }
      if (resp.statusCode !== 200) { return console.error('logout failed'); }

      stores.auth.set({
        name: null,
        picture: null
      });
    });
  };

  actions.setRoute = function (args) {
    stores.route.set({
      current: args.route
    });
  };

  actions.loadChart = function (args, cb) {
    xhr({
      uri: '/api/charts/' + args.chartType
    }, function (err, resp, body) {
      if (err) { return cb(err); }
      if (resp.statusCode !== 200) { return cb(new Error(resp)); }

      var data;
      try {
        data = JSON.parse(body);
      }
      catch (e) {
        return cb(new Error('invalid body'));
      }

      cb(null, data);
    });
  };

  return actions;
};
