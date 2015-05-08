const React = require('react');
const paramify = require('paramify');

function setup (createConnectedComponent) {
  var Charts = createConnectedComponent(require('./charts'), [], function (stores, props) {
    return {};
  });

  var Wiki = createConnectedComponent(require('./wiki/wiki'), ['wiki'], function (stores, props) {
    const docs = stores.wiki.get();
    return {
      doc: docs[props.id]
    };
  });

  return React.createClass({
    render: function () {
      if (!this.props.isLoggedIn) { return null; }

      const match = paramify(this.props.route);

      if (match('/')) {
        return <Charts />;
      }

      if (match('/wiki/:id?')) {
        // TODO: this needs to come from config.js
        const defaultDocId = 'welcome';
        const id = match.params.id || defaultDocId;

        return <Wiki id={id} />;
      }
    }
  });
}

module.exports = setup;
