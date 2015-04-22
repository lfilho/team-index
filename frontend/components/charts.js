var React = require('react');

var TeamSizeChart = require('./charts/team-size');
var EndOfContractChart = require('./charts/end-of-contract');

module.exports = React.createClass({
  render: function () {
    return (
      <div className="charts">
        <TeamSizeChart />
        <EndOfContractChart />
      </div>
    );
  }
});
