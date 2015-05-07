'use strict';

const bind = require('bind-fn');
const arrayFrom = require('./array-from');
const querystring = require('querystring');

function createDataPoint (docIndex, teamsAtTime) {
  let sum = function (acc, val) {
    return (parseInt(acc, 10) || 0) + parseInt(val, 10);
  };

  let teamIds = arrayFrom(teamsAtTime.teams.teams) || [];
  let teams = {};
  teamIds.forEach(function (teamId) {
    let doc = docIndex.getDoc(teamId);
    let hours = teamsAtTime.teams.memberHoursByTeam.get(teamId) || new Map();

    teams[teamId] = {
      title: doc.title,
      totalHours: arrayFrom(hours.values()).reduce(sum, 0)
    };
  });

  return {
    teams: teams
  };
}

function getDataPoints (docIndex, timelineIndex, from, to, cb) {
  const teamsAtTime = require('./team-at-time')(docIndex);

  let points = [];
  let pushDataPoint = function (ts) {
    points.push({
      ts: ts,
      data: createDataPoint(docIndex, teamsAtTime)
    });
  };

  timelineIndex.catchup();
  timelineIndex.db.readStream({
    keys: false,
    gte: 0,
    lt: [from]
  })
    .on('data', bind(teamsAtTime, 'through'))
    .on('close', function () {
      // create the first data point
      pushDataPoint(from);

      // read remaining events, creating a new data point for each
      timelineIndex.db.readStream({
        keys: false,
        gte: [from],
        lte: [to]
      })
        .on('data', function (event) {
          teamsAtTime.through(event);
          pushDataPoint(event.ts);
        })
        .on('close', function () {
          if (cb) {
            cb(null, points);
          }
        });
    });
}

module.exports = getDataPoints;
