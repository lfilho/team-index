var React = require('react');

/*

  Session global
  ====

  `window.authState` is set in the page template, containing info about the current user's authentication.

*/

var Store = require('./lib/store');

var stores = {};

// ----

stores.auth = new Store({
  name: window.authState.name,
  picture: window.authState.picture
});

stores.auth.isLoggedIn = function () {
  return !!this.data.name;
};

// ----

var currentRoute = location.hash.replace(/^\#/, '');
stores.route = new Store({
  current: currentRoute
});

// ----

stores.wiki = new Store({});

// ----

var actions = {};

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

var assign = require('object-assign');
var archieml = require('archieml');
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

var xhr = require('xhr');
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

// ----

var createConnectedComponent = require('./lib/create-connected-component')(stores, actions);
var DashboardApp = require('./components/dashboard-app')(createConnectedComponent);

React.render(
  React.createElement(DashboardApp),
  document.getElementById('app')
);

// ----

window.stores = stores;
window.actions = actions;
