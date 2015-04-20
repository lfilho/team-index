var React = require('react');

function setup (createConnectedComponent) {
  var Charts = createConnectedComponent(require('./charts'), [], function (stores, props) {
    return {};
  });

  var Wiki = createConnectedComponent(require('./wiki'), ['wiki'], function (stores, props) {
    return {
      docs: stores.wiki.get()
    };
  });

  return React.createClass({
    render: function () {
      console.log('render: MainContent', this.props);

      if (!this.props.isLoggedIn) {
        return <div>Log in to get started</div>;
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
