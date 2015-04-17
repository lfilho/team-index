var React = require('react');

var AuthControls = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    picture: React.PropTypes.string,
    actionCallback: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      name: null
    };
  },

  getInitialState: function () {
    return {
      loading: false
    };
  },

  componentWillReceiveProps: function (newProps) {
    this.setState({ loading: false });
  },

  handleLogoutClick: function () {
    this.setState({ loading: true });
    this.props.actionCallback('logout');
  },

  handleLoginClick: function () {
    this.setState({ loading: true });
    this.props.actionCallback('login');
  },

  render: function () {
    if (this.state.loading) {
      return <div>...loading...</div>;
    }

    return this.props.name ? this._renderLoggedIn() : this._renderLoggedOut();
  },

  _renderLoggedIn: function () {
    return (
      <div>
        <img src={this.props.picture} />
        Welcome back {this.props.name}&nbsp;
        <button onClick={this.handleLogoutClick}>Logout</button>
      </div>
    );
  },

  _renderLoggedOut: function () {
    return (
      <div>
        <button onClick={this.handleLoginClick}>Login</button>
      </div>
    );
  }
})

module.exports = AuthControls;
