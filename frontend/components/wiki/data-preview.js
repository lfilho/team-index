'use strict';

const React = require('react');
const linkify = require('html-linkify');

module.exports = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  displayName: 'DataPreview',

  _renderItems (data) {
    const items = Object.keys(data).map(function (key) {
      // ignore reserved keys
      if (key[0] === '_') { return; }

      let val = data[key];
      let valHtml = val && { __html: linkify(val) };
      const valElem = valHtml && <span className="value" dangerouslySetInnerHTML={valHtml}/>;

      return <li key={key}>{key + ': '} {valElem}</li>;
    });

    return items.filter(Boolean);
  },

  render () {
    const items = this._renderItems(this.props.data);
    if (!items.length) { return null; }

    return (
      <div>
        <h2>Data</h2>
        <ul>
          {items}
        </ul>
      </div>
    );
  }
});
