var React = require('react');

function setup (createConnectedComponent) {

  var TeamSizeChart = createConnectedComponent(require('./charts/team-size'), [], function () {
    return {};
  });

  var EndOfContractChart = createConnectedComponent(require('./charts/end-of-contract'), [], function () {
    return {};
  });

  return React.createClass({
    render: function () {
      return (
        <div className="charts">
          <TeamSizeChart />
          <EndOfContractChart />
        </div>
      );
    }
  });
}

module.exports = setup;
