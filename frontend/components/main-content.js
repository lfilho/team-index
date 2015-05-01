var React = require('react');
const paramify = require('paramify');

function setup (createConnectedComponent) {
  var Charts = createConnectedComponent(require('./charts'), [], function (stores, props) {
    return {};
  });

  var Wiki = createConnectedComponent(require('./wiki/wiki'), ['wiki'], function (stores, props) {
    return {
      docs: stores.wiki.get()
    };
  });

  return React.createClass({
    render: function () {
      if (!this.props.isLoggedIn) {
        return <div className="welcome">X-TEAM DASHBOARD</div>;
      }

      const match = paramify(this.props.route);

      if (match('/')) {
        return <Charts />;
      }

      if (match('/wiki/:id?')) {
        const defaultDocId = 'home';
        const id = match.params.id || defaultDocId;

        return <Wiki id={id} />;
      }
    }
  });
}

module.exports = setup;
