'use strict';

const bind = require('bind-fn');
const arrayFrom = require('./array-from');
const querystring = require('querystring');

function sum (acc, val) {
  return (parseInt(acc, 10) || 0) + parseInt(val, 10);
}

function createDataPoint (docIndex, teamsAtTime) {
  const teamIds = arrayFrom(teamsAtTime.teams.teams) || [];
  const teams = {};
  teamIds.forEach(function (teamId) {
    const doc = docIndex.getDoc(teamId);
    const hours = teamsAtTime.teams.memberHoursByTeam.get(teamId) || new Map();

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

  const points = [];
  const pushDataPoint = function (ts) {
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
          // create the last data point
          pushDataPoint(to);

          if (cb) {
            cb(null, points);
          }
        });
    });
}

module.exports = getDataPoints;
