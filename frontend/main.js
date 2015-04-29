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

var currentRoute = location.hash.replace(/^\#/, '') || '/';
stores.route = new Store({
  current: currentRoute,
  docId: 'home'
});

// ----

stores.wiki = new Store({});

// ----

const actions = require('./actions')(stores);
const createConnectedComponent = require('./lib/create-connected-component')(stores, actions);
const DashboardApp = require('./components/dashboard-app')(createConnectedComponent);

React.render(
  React.createElement(DashboardApp),
  document.getElementById('app')
);

// ----

window.stores = stores;
window.actions = actions;
