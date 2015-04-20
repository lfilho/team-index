var React = require('react');

var MainContent = React.createClass({
  render: function () {
    console.log('render: MainContent', this.props);

    var msg = this.props.isLoggedIn ?
        'The current route is ' + this.props.route :
        'Log in to get started';

    return (
        <div>
        {msg}
      </div>
    );
  }
})

module.exports = MainContent;
