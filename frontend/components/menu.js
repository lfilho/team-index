var React = require('react');

var Menu = React.createClass({
  onClick: function (route) {
    this.props.actionCallback('setRoute', { route: route });
  },

  onSearch: function (event) {
    event.preventDefault();

    const elem = this.refs.search.getDOMNode();
    const value = elem.value;
    this.props.actionCallback('search', { q: value });
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

    itemElems.push(
      <li key="search" className="search">
        <form onSubmit={this.onSearch}>
          <input ref="search" placeholder="Search..." />
        </form>
      </li>
    );

    return (
      <ul>{itemElems}</ul>
    );
  }
})

module.exports = Menu;
