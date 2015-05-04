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

stores.auth.clear = function () {
  this.set({
    name: null,
    picture: null
  });
};

// ----

function getRouteFromHash () {
  return location.hash.replace(/^\#/, '') || '/';
}

stores.route = new Store({
  current: getRouteFromHash()
});

// ----

stores.wiki = new Store({});

// ----
// watch for changes to hash

window.addEventListener('hashchange', function (event) {
  stores.route.set({
    current: getRouteFromHash()
  });
});

stores.route.addListener(function () {
  const data = stores.route.get();
  location.hash = data.current;
});

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
