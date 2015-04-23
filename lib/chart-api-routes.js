'use strict';

let bind = require('bind-fn');
let arrayFrom = require('./array-from');
let sendJson = require('send-data/json');
let sendError = require('./send-error');

let timelineIndex;

function createTimelineIndex (docIndex) {
  if (!timelineIndex) {
    timelineIndex = require('./timeline-index')(docIndex, {
      // for teams we record events of when the team started or ended
      team: ['startedAt', 'endedAt'],

      // for team memberships we record events of when the membership started or ended
      teamMembership: ['startedAt', 'endedAt']
    });
  }

  return timelineIndex;
}

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
  let teamsAtTime = require('./team-at-time')(timelineIndex);
  teamsAtTime.catchup();

  let points = [];
  let pushDataPoint = function (ts) {
    points.push({
      ts: ts,
      data: createDataPoint(docIndex, teamsAtTime)
    });
  };

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
        gt: [from],
        lt: [to]
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

function addRoutes (router, sessionStore, db, docIndex) {
  let restrict = require('./restrict').bind(null, sessionStore);

  router.addRoute('/api/charts/team-size', {
    GET: restrict(function (req, res, opts) {
     var to = Date.now();
     var from = to - (1000 * 3600 * 24 * 61);

      getDataPoints(docIndex, createTimelineIndex(docIndex), from, to, function (err, points) {
        sendJson(req, res, points);
      });
    })
  });
}

module.exports = addRoutes;
