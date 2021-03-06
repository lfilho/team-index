/*

The "state wrapper" handles sending and receiving state updates between the component and the data store.

This means that components can be built without much knowledge of the surrounding architecture. They should use props for pretty much everything, and signal updates via the `actionCallback` prop.

*/
var React = require('react');

function setup (stores, actions) {
  function create (c, storeNames, loadState) {
    const isFunc = (typeof c === 'function');
    const isReactClass = (isFunc && typeof c.prototype.render === 'function');

    // if this is a setup function, call it to get a react class.
    const Component = (isFunc && !isReactClass) ? c(create) : c;

    return React.createClass({

      getInitialState: function () {
        return loadState(stores, this.props);
      },

      componentDidMount: function () {
        const self = this;
        storeNames.forEach(function (name) {
          stores[name].addListener(self.onStoreChanged);
        });
      },

      componentWillUnmount: function () {
        const self = this;
        storeNames.forEach(function (name) {
          stores[name].removeListener(self.onStoreChanged);
        });
      },

      componentWillReceiveProps: function (nextProps) {
        this.setState(loadState(stores, nextProps));
      },

      onStoreChanged: function () {
        if (!this.isMounted()) { return; }

        this.setState(loadState(stores, this.props));
      },

      onAction: function (type, args, cb) {
        if (!actions.hasOwnProperty(type)) {
          console.error('Unknown action', type);
          return;
        }

        actions[type](args, cb);
      },

      render: function () {
        return <Component {...this.props} {...this.state} actionCallback={this.onAction} />;
      }
    });
  }

  return create;
}

module.exports = setup;
