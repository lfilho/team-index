'use strict';

const archieml = require('archieml');
const assign = require('object-assign');
const querystring = require('querystring');
const xhr = require('xhr');

module.exports = function (stores) {
  const actions = {};

  function doXhr (opts, cb) {
    xhr(opts, function (err, resp, body) {
      if (err) {
        alert('Oh nos! We couldn\'t complet your request!\nIf you\'re sure you\'re online, contact the admin to make sure his server also is :-)');
        return cb(err);
      }

      if (resp.statusCode === 403) {
        stores.auth.clear();
        let err = new Error('save failed');
        err.statusCode = resp.statusCode;
        return cb(err);
      }

      cb(err, resp, body);
    });
  }

  function loadWikiDoc (id, cb) {
    doXhr({
      url: '/api/docs/' + id,
      json: true
    }, function (err, resp, body) {
      if (err) { return cb(err); }

      // not found
      if (resp.statusCode === 404) {
        return cb(null, null);
      }

      if (resp.statusCode !== 200) {
        return cb(new Error('load failed'));
      }

      cb(null, body.doc);
    });
  }

  actions.wikiLoad = function (args, cb) {
    cb = cb || function () {};

    // don't need to load if already in memory
    const doc = stores.wiki.data[args.id];
    if (doc) {
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
      _type: args.type
    };

    if (args.body) {
      doc = assign(archieml.load(args.body), doc);
    }

    doXhr({
      uri: '/api/entries',
      method: 'POST',
      json: doc
    }, function (err, resp, body) {
      if (err) { return cb(err); }

      if (resp.statusCode !== 200) { return cb(new Error('save failed')); }

      // notify caller
      cb();

      // update the store with the saved data
      let docs = stores.wiki.get();
      if (docs[args.id]) {
        if (!doc._type) { delete doc._type; }
        assign(docs[args.id], doc);
      }
      else {
        docs[args.id] = doc;
      }
      stores.wiki.set(docs);
    });
  };

  actions.login = function (args) {
    location.href = '/login';
  };

  actions.logout = function () {
    doXhr({
      uri: '/logout'
    }, function (err, resp, body) {
      if (err) { return console.error(err); }

      if (resp.statusCode !== 200) { return console.error('logout failed'); }

      stores.auth.clear();
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
      current: '/wiki/' + args.q
    });
  };

  actions.loadChart = function (args, cb) {
    const endpoint = '/api/charts/' + args.chartType;
    delete args.chartType;
    const params = querystring.stringify(args);
    const uri = endpoint + (params ? '?' : '') + params;

    doXhr({
      uri: uri,
      json: true
    }, function (err, resp, body) {
      if (err) { return cb(err); }

      if (resp.statusCode !== 200) { return cb(new Error(resp)); }

      cb(null, body);
    });
  };

  actions.loadTeamMembers = function (args, cb) {
    const uri = '/api/teams/' + args.teamId;

    doXhr({
      uri: uri,
      json: true
    }, function (err, resp, body) {
      if (err) { return cb(err); }
      if (resp.statusCode !== 200) { return cb(new Error(resp)); }

      cb(null, body);
    });
  };

  return actions;
};
