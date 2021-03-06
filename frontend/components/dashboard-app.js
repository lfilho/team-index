const React = require('react');

function setup (createConnectedComponent) {
  const MainContent = createConnectedComponent(require('./main-content'), ['auth', 'route'], function (stores, props) {
    return {
      isLoggedIn: stores.auth.isLoggedIn(),
      route: stores.route.data.current
    };
  });

  const AuthControls = createConnectedComponent(require('./auth-controls'), ['auth'], function (stores, props) {
    return stores.auth.get();
  });

  const Menu = createConnectedComponent(require('./menu'), ['auth', 'route'], function (stores, props) {
    return {
      isLoggedIn: stores.auth.isLoggedIn(),
      route: stores.route.data.current
    };
  });

  return React.createClass({
    render: function () {
        return (
          <div>
            <header>
              <div className="menu">
                <Menu />
              </div>
              <div className="user">
                <AuthControls />
              </div>
            </header>
            <div className="main">
              <MainContent />
            </div>
          </div>
        );
      }
    });
}

module.exports = setup;
