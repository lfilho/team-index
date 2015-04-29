var React = require('react');

function setup (createConnectedComponent) {
  var Charts = createConnectedComponent(require('./charts'), [], function (stores, props) {
    return {};
  });

  var Wiki = createConnectedComponent(require('./wiki'), ['route', 'wiki'], function (stores, props) {
    const id = stores.route.get().docId;

    return {
      id: id,
      docs: stores.wiki.get()
    };
  });

  return React.createClass({
    render: function () {
      if (!this.props.isLoggedIn) {
        return <div className="welcome">X-TEAM DASHBOARD</div>;
      }

      var componentsByRoute = {
        '/': Charts,
        '/wiki': Wiki
      };

      var Component = componentsByRoute[this.props.route];
      if (!Component) { return null; }


      return <Component />;
    }
  });
}

module.exports = setup;
