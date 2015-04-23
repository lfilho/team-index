var React = require('react');

var arrayFrom = require('../../../lib/array-from');

function createDataSeries (points) {
  var series = [];

  // check all data points for a full set of teams
  var teamIdSet = new Set();
  points.forEach(function (point) {
    Object.keys(point.data.teams).forEach(function (teamId) {
      teamIdSet.add(teamId);
    });
  });

  var teamIds = arrayFrom(teamIdSet);
  var teamTotals = {};
  teamIds.forEach(function (teamId) {
    teamTotals[teamId] = [];
  });

  points.forEach(function (point) {
    var teams = point.data.teams;
    teamIds.forEach(function (teamId) {
      var team = teams[teamId] || {};
      teamTotals[teamId].push(team.totalHours || 0);
    });
  });

  var teams = points[0].data.teams;
  teamIds.forEach(function (teamId) {
    var team = teams[teamId];
    series.push({
      name: team.title,
      data: teamTotals[teamId]
    });
  });

  return series;
}

function createChart (series) {
  new Highcharts.Chart({
    chart: {
      renderTo: 'team-size-chart',
      type: 'area'
    },
    title: {
      text: ''
    },
    xAxis: {
      tickmarkPlacement: 'on',
      title: {
        enabled: false
      }
    },
    yAxis: {
      title: {
        text: 'Devs Hours per Week'
      }
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        lineColor: '#666666',
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: '#666666'
        }
      }
    },
    series: series
  });
}

var Highchart = React.createClass({
  render: function () {
    return <div id="team-size-chart"></div>;
  },

  shouldComponentUpdate: function (props) {
    return false;
  },

  componentDidMount: function () {
    var series = createDataSeries(this.props.points);
    createChart(series);
  },

  componentWillReceiveProps: function (newProps) {
    if (!newProps.hasOwnProperty('points')) { return; }

    var series = createDataSeries(newProps.points);
    createChart(series);
  }
});

module.exports = React.createClass({
  getInitialState: function () {
    return {
      points: []
    };
  },

  componentDidMount: function () {
    var self = this;
    this.props.actionCallback('loadChart', { chartType: 'team-size' }, function (err, points) {
      self.setState({ points });
    });
  },

  render: function () {
    var points = this.state.points;
    var chart = points && points.length ? <Highchart points={points} /> : null;

    return (
      <div className="team-size">
        <h2>Teams</h2>

        From: <input name="from" />
        To: <input name="to" />

        <div className="chart">{chart}</div>
      </div>
    );
  }
});
