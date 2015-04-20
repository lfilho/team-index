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

stores.route = new Store({
  current: '/'
});

// ----

var actions = {};

actions.login = function (args) {
  location.href = '/login';
};

var xhr = require('xhr');
actions.logout = function () {
  xhr({
    uri: '/logout',
  }, function (err, resp, body) {
    if (err) { return cb(err); }
    if (resp.statusCode !== 200) { console.error('logout failed'); }

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

var createConnectedComponent = require('./lib/create-connected-component')(stores, actions);
var DashboardApp = require('./components/dashboard-app')(createConnectedComponent);

React.render(
  React.createElement(DashboardApp),
  document.getElementById('app')
);

window.stores = stores;
window.actions = actions;
