var React = require('react');
var Auth = require('./auth-controls');
var stateWrapper = require('./state-wrapper');

var App = React.createClass({
  propTypes: {
    actionHandler: React.PropTypes.object.isRequired
  },

  render: function () {
    var WrappedAuth = stateWrapper(Auth, this.props.actionHandler);
    return (
      <div>
        <WrappedAuth />
      </div>
    );
  }
});

module.exports = App;
