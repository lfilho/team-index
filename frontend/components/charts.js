var React = require('react');

module.exports = React.createClass({
  render: function () {
    console.log('render: Charts', this.props);

    return (
      <div>Charts go here</div>
    );
  }
});
