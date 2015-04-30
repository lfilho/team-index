'use strict';

const archieml = require('archieml');
const assign = require('object-assign');
const querystring = require('querystring');
const xhr = require('xhr');

function loadWikiDoc (id, cb) {
  xhr({
    url: '/api/docs/' + id
  }, function (err, resp, body) {
    if (err) { return console.error(err); }

    // not found: create a placeholder
    if (resp.statusCode === 404) {
      return cb(null, null);
    }

    if (resp.statusCode !== 200) {
      return cb(new Error('load failed'));
    }

    let data;
    try {
      data = JSON.parse(body);
    }
    catch (e) {
      return cb(new Error('invalid body'));
    }

    cb(null, data.doc);
  });
}

module.exports = function (stores) {
  const actions = {};

  actions.wikiLoad = function (args, cb) {
    cb = cb || function () {};

    // don't need to load if already in memory
    const doc = stores.wiki.data[args.id];
    if (!!doc) {
      return cb(null, doc);
    }

    loadWikiDoc(args.id, function (err, doc) {
      if (err) {
        console.error(err);
        return cb(err);
      }

      if (!doc) { return cb(null, null); }

      const docs = {};
      docs[args.id] = doc;
      stores.wiki.set(docs);
      cb(null, doc);
    });
  };

  actions.wikiSave = function (args, cb) {
    cb = cb || function () {};

    let doc = {
      _id: args.id,
      _type: args.type,
    };

    if (args.body) {
      doc = assign(archieml.load(args.body), doc);
    }

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

  actions.search = function (args) {
    // TODO: if the search query contains chars that are invalid for a doc ID,
    // assume it's a search rather than a doc
    stores.route.set({
      current: '/wiki',
      docId: args.q
    });
  },

  actions.loadChart = function (args, cb) {
    const endpoint = '/api/charts/' + args.chartType;
    delete args.chartType;
    const params = querystring.stringify(args);
    const uri = endpoint + (params ? '?' : '') + params;

    xhr({
      uri: uri
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
