const React = require('react');

const Menu = React.createClass({
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
    if (!this.props.isLoggedIn) {
      return <div className="welcome">Dashboard</div>;
    }

    const items = [];

    items.push({
      route: '/',
      title: 'Home'
    });

    items.push({
      route: '/wiki',
      title: 'Wiki'
    });

    const itemElems = items.map(function (item, i) {
      const title = item.title;
      const href = '#' + item.route;
      const onClick = this.onClick.bind(this, item.route);

      const link = (item.route === this.props.route) ?
          <span className="active">{title}</span> :
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
});

module.exports = Menu;
