/*

The "state wrapper" handles sending and receiving state updates between the component and the data store.

This means that components can be built without much knowledge of the surrounding architecture. They should use props for pretty much everything, and signal updates via the `actionCallback` prop.

*/
var React = require('react');

module.exports = function (Component, actionHandler, initState) {
  return React.createClass({

    getInitialState: function () {
      return initState || {};
    },

    onAction: function (type, data) {
      var self = this;

      actionHandler.onAction(type, data, function (err, newState) {
        if (err) {
          return console.error(err);
        }

        self.setState(newState);
      });
    },

    render: function () {
      return <Component {...this.state} actionCallback={this.onAction} />;
    }
  });
};
