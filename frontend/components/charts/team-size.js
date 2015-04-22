var React = require('react');

module.exports = React.createClass({
  render: function () {
    return (
      <div className="team-size">
        <h2>Teams</h2>

        From: <input name="from" />
        To: <input name="to" />

        <div className="chart"></div>
      </div>
    );
  }
});
