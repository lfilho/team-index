var React = require('react');

const moment = require('moment');
const CHART_TYPE = 'ending-contracts';
const WikiLink = require('../wiki-link');

var Memberships = React.createClass({
  render: function () {
    let memberships = this.props.src;

    let items = memberships.map(function(membership) {
      let [id, name, endDate, teamAndHours] = [
        membership._id,
        membership.person,
        moment(membership.endedAt).fromNow(),
        <small><em>({membership.team}, {membership.hoursPerWeek}h)</em></small>,
        membership.hoursPerWeek
      ];

      let wikiLink = <WikiLink id={id}>{name} {teamAndHours} → {endDate}</WikiLink>;

      return <li key={id}>{wikiLink}</li>
    });

    return <ul>{items}</ul>;
  }
});

module.exports = React.createClass({
  getInitialState: function () {
    return {
      memberships: []
    };
  },

  componentDidMount: function () {
    var self = this;
    this.props.actionCallback('loadChart', { chartType: CHART_TYPE }, function (err, result) {
      if (err) { console.log('Error loading chart:', err);}

      self.setState({ memberships: result.memberships });
    });
  },

  render: function () {
    let memberships = this.state.memberships;
    let chart = <Memberships src={memberships} />;

    return (
      <div className="end-of-contract">
        <h2>Developers nearing end of contract</h2>
        <div className="chart">{chart}</div>
      </div>
    );
  }
});
