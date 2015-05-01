var React = require('react');
const paramify = require('paramify');

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
      if (!this.props.isLoggedIn) {
        return <div className="welcome">X-TEAM DASHBOARD</div>;
      }

      let Component;
      const match = paramify(this.props.route);
      if (match('/')) {
        Component = Charts;
      }
      else if (match('/wiki/:id?')) {
        Component = Wiki;
        if (!match.params.id) {
          match.params.id = 'home';
        }
      }

      if (!Component) { return null; }

      return <Component {...match.params} />;
    }
  });
}

module.exports = setup;
