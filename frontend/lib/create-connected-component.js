/*

The "state wrapper" handles sending and receiving state updates between the component and the data store.

This means that components can be built without much knowledge of the surrounding architecture. They should use props for pretty much everything, and signal updates via the `actionCallback` prop.

*/
var React = require('react');

function setup (stores, actions) {
  function create (Component, storeNames, loadState) {
    var isFunc = (typeof Component === 'function');
    var isReactClass = (isFunc && typeof Component.prototype.render === 'function');

    // if this is a setup function, call it to get a react class.
    if (isFunc && !isReactClass) {
      Component = Component(create);
    }

    return React.createClass({

      getInitialState: function () {
        return loadState(stores, this.props);
      },

      componentDidMount: function () {
        var self = this;
        storeNames.forEach(function (name) {
          stores[name].addListener(self.onStoreChanged);
        });
      },

      componentWillUnmount: function () {
        var self = this;
        storeNames.forEach(function (name) {
          stores[name].removeListener(self.onStoreChanged);
        });
      },

      onStoreChanged: function () {
        if (!this.isMounted()) { return; }

        this.setState(loadState(stores, this.props));
      },

      onAction: function (type, args) {
        if (!actions.hasOwnProperty(type)) {
          console.error('Unknown action', type);
          return;
        }

        actions[type](args);
      },

      render: function () {
        return <Component {...this.props} {...this.state} actionCallback={this.onAction} />;
      }
    });
  };

  return create;
};

module.exports = setup;
