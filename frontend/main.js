var React = require('react');
var DashboardApp = require('./components/app');

/*

  Session global
  ====

  `window.authState` is set in the page template, containing info about the current user's authentication.

*/
var actionHandler = require('./lib/action-handler')({
  auth: window.authState || {}
});

React.render(
  React.createElement(DashboardApp, { actionHandler: actionHandler }),
  document.getElementById('app')
);
