const React = require('react');

module.exports = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired
  },

  render: function () {
    const href = '#/wiki/' + this.props.id;
    const text = this.props.children || this.props.id;

    return <a className="wiki-link" href={href}>{text}</a>;
  }
});
