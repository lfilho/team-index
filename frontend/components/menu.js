var React = require('react');

var Menu = React.createClass({
  onClick: function (route) {
    this.props.actionCallback('setRoute', { route: route });
  },

  render: function () {
    if (!this.props.isLoggedIn) { return null; }

    var items = [];

    items.push({
      route: '/',
      title: 'Home'
    });

    items.push({
      route: '/wiki',
      title: 'Wiki'
    });

    var itemElems = items.map(function (item, i) {
      var title = item.title;
      var href = '#' + item.route;
      var onClick = this.onClick.bind(this, item.route);

      var link = (item.route === this.props.route) ?
          item.title :
          <a href={href} onClick={onClick}>{title}</a>;

      return (
        <li key={i}>
          {link}
        </li>
      );
    }.bind(this));

    return (
      <ul>{itemElems}</ul>
    );
  }
})

module.exports = Menu;
