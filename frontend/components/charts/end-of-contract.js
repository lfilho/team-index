'use strict';

const React = require('react');
const moment = require('moment');
const CHART_TYPE = 'ending-contracts';
const WikiLink = require('../wiki/wiki-link');

const Memberships = React.createClass({
  render: function () {
    const memberships = this.props.src;

    const items = memberships.map(function(membership) {
      const id = membership._id;
      const personId = membership.person;
      const relativeEndDate = moment(Number(membership.endedAt)).fromNow();
      const teamAndHours = membership.team + ', ' + membership.hoursPerWeek + 'h';
      const teamAndHoursElem = <small><em>({teamAndHours})</em></small>;
      const wikiLink = <WikiLink id={id}>{personId} {teamAndHoursElem} → {relativeEndDate}</WikiLink>;

      return <li key={id}>{wikiLink}</li>;
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
    const self = this;
    this.props.actionCallback('loadChart', { chartType: CHART_TYPE }, function (err, result) {
      if (err) { console.log('Error loading chart:', err); }

      self.setState({ memberships: result.memberships });
    });
  },

  render: function () {
    const memberships = this.state.memberships;
    const chart = <Memberships src={memberships} />;

    return (
      <div className="end-of-contract">
        <h2>Developers nearing end of contract</h2>
        <div className="chart">{chart}</div>
      </div>
    );
  }
});
