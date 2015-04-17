var React = require('react');
var DashboardApp = require('./components/app');
var actionHandler = require('./lib/action-handler')({
  auth: {
    userEmail: null
  }
});

React.render(
  React.createElement(DashboardApp, { actionHandler: actionHandler }),
  document.getElementById('app')
);
