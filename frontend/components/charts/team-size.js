var React = require('react');

var arrayFrom = require('../../../lib/array-from');
const CHART_TYPE = 'team-size';

/*

  Insert some extra points to the data series so that changes appear to happen instantly,
  rather than ramping up gradually (since this is a more realistic representation).

*/
function insertFlatteningPoints (totals) {
  const points = [];
  let lastPoint;
  totals.forEach(function (point) {
    // insert a point 1 ms prior to the real one, with the same value as the previous
    if (lastPoint) {
      points.push([
        point[0] - 1,
        lastPoint[1]
      ]);
    }

    lastPoint = point;
    points.push(point);
  });
  return points;
}

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
      teamId: teamId,
      data: insertFlatteningPoints(teamTotals[teamId])
    });
  });

  return series;
}

function createChart (series) {
  let chart = new Highcharts.Chart({
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
      series: {
        cursor: 'pointer',
        events: {
          click: function() {
            window.location.hash = '/wiki/' + this.options.teamId;
          }
        }
      },
      area: {
        stacking: 'normal',
        trackByArea: true,
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
    const ONE_MONTH = 1000 * 3600 * 24 * 31;
    const NOW = Date.now();

    return {
      points: [],
      to: NOW + ONE_MONTH,
      from: NOW - ONE_MONTH
    };
  },

  componentDidMount: function () {
    let self = this;
    let to = this.state.to;
    let from = this.state.from;

    this.props.actionCallback('loadChart', { chartType: CHART_TYPE, to, from }, function (err, points) {
      if (err) { console.log('Error loading chart:', err); }

      self.setState({ points });
    });
  },

  onClickUpdateTimeframe: function (event) {
    event.preventDefault();
    let self = this;
    let to = Date.parse(this.refs.toField.getDOMNode().value.trim());
    let from = Date.parse(this.refs.fromField.getDOMNode().value.trim());

    this.props.actionCallback('loadChart', { chartType: CHART_TYPE, to, from }, function (err, points) {
      if (err) { console.log('Error updating chart:', err); }

      self.setState({ points, to, from });
    });
  },

  render: function () {
    var points = this.state.points;
    let to = new Date(this.state.to).toISOString().split('T')[0];
    let from = new Date(this.state.from).toISOString().split('T')[0];

    var chart = points && points.length ? <Highchart points={points} /> : null;

    return (
      <div className="team-size">
        <h2>Teams</h2>

        From: <input ref="fromField" name="from" placeholder="YYYY-MM-DD" defaultValue={from} />
        To: <input ref="toField" name="to" placeholder="YYYY-MM-DD" defaultValue={to} />
        <button name="updateTimeframe" onClick={this.onClickUpdateTimeframe}>Update timeframe</button>

        <div className="chart">{chart}</div>
      </div>
    );
  }
});
