var React = require('react');

module.exports = React.createClass({
  render: function () {
    console.log('render: Wiki', this.props);

    return (
      <div>Wiki goes here</div>
    );
  }
});
