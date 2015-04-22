var React = require('react');

var Highchart = React.createClass({
  render: function () {
    return <div id="team-size-chart"></div>;
  },

  shouldComponentUpdate: function (props) {
    return false;
  },

  componentDidMount: function () {
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
          text: '# of Devs'
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
      series: [{
        name: 'Gamecrate',
        data: [3, 5, 8, 8, 8, 5, 5]
      }, {
        name: 'Tumbleplay',
        data: [3, 5, 5, 5, 7, 8, 10]
      }, {
        name: 'Black Mnt',
        data: [1, 1, 3, 3, 3, 3, 3]
      }, {
        name: 'Fox',
        data: [6, 7, 8, 7, 10, 7, 5]
      }, {
        name: 'Cool Project, Bro',
        data: [2, 2, 4, 4, 2, 5, 4]
      }]
    });
  }
});

module.exports = React.createClass({
  render: function () {
    return (
      <div className="team-size">
        <h2>Teams</h2>

        From: <input name="from" />
        To: <input name="to" />

        <div className="chart"><Highchart /></div>
      </div>
    );
  }
});
