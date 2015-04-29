var React = require('react');

var arrayFrom = require('../../../lib/array-from');
const CHART_TYPE = 'team-size';

function createDataSeries (points) {
  var series = [];

  // check all data points for a full set of teams
  var teamIdSet = new Set();
  points.forEach(function (point) {
    Object.keys(point.data.teams).forEach(function (teamId) {
      teamIdSet.add(teamId);
    });
  });

  // get a list of team IDs and initialize totals for each team
  var teamIds = arrayFrom(teamIdSet);
  var teamTotals = {};
  teamIds.forEach(function (teamId) {
    teamTotals[teamId] = [];
  });

  // create the list of totals by team
  points.forEach(function (point) {
    var teams = point.data.teams;
    teamIds.forEach(function (teamId) {
      var team = teams[teamId] || {};
      teamTotals[teamId].push([point.ts, team.totalHours || 0]);
    });
  });

  // sort teamIds by hours (just looking at first data point)
  teamIds.sort(function (a, b) {
    return teamTotals[a][0][1] > teamTotals[b][0][1] ? 1 : -1;
  });

  // format as highcharts series
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
      type: 'area',
      zoomType: 'x'
    },
    title: {
      text: ''
    },
    xAxis: {
      tickmarkPlacement: 'on',
      title: {
        enabled: false
      },
      type: 'datetime',
      labels: {
        rotation: 45,
        align: 'left'
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
    this.props.actionCallback('loadChart', { chartType: CHART_TYPE }, function (err, points) {
      if (err) { console.log('Error loading chart:', err);}

      self.setState({ points });
    });
  },

  onClickUpdateTimeframe: function (event) {
    event.preventDefault();
    let self = this;
    let to = Date.parse(this.refs.toField.getDOMNode().value.trim());
    let from = Date.parse(this.refs.fromField.getDOMNode().value.trim());

    this.props.actionCallback('loadChart', { chartType: CHART_TYPE, to, from }, function (err, points) {
      if (err) { console.log('Error updating chart:', err);}

      self.setState({ points });
    });
  },

  render: function () {
    var points = this.state.points;
    var chart = points && points.length ? <Highchart points={points} /> : null;

    return (
      <div className="team-size">
        <h2>Teams</h2>

        From: <input ref="fromField" name="from" placeholder="YYYY-MM-DD"/>
        To: <input ref="toField" name="to" placeholder="YYYY-MM-DD" />
        <button name="updateTimeframe" onClick={this.onClickUpdateTimeframe}>Update timeframe</button>

        <div className="chart">{chart}</div>
      </div>
    );
  }
});
