var React = require('react');
var Auth = require('./auth-controls');
var stateWrapper = require('./state-wrapper');

var App = React.createClass({
  propTypes: {
    actionHandler: React.PropTypes.object.isRequired
  },

  render: function () {
    var actionHandler = this.props.actionHandler;
    var WrappedAuth = stateWrapper(Auth, actionHandler, actionHandler._data.auth);
    return (
      <div>
        <header>
          <div className="menu"></div>
          <div className="user">
            <WrappedAuth />
          </div>
        </header>
      </div>
    );
  }
});

module.exports = App;
