'use strict';

let Fingdex = require('fingdex');
let bind = require('bind-fn');
let arrayFrom = require('./array-from');

// ----
// create an index that will aggregate entries into docs

function createDocIndex (sourceIndex) {
  // default values for documents, by type
  let docDefaults = {};

  docDefaults.team = {
    startedAt: 0
  };

  docDefaults.teamMembership = {
    startedAt: 0,
    hoursPerWeek: 40
  };

  return require('fingdex/lib/doc-index')(sourceIndex, docDefaults);
}

// ----
// create an index that infer a timeline of events from docs

function createTimelineIndex (docIndex) {
  return require('./timeline-index')(docIndex, {
    // for teams we record events of when the team started or ended
    team: ['startedAt', 'endedAt'],

    // for team memberships we record events of when the membership started or ended
    teamMembership: ['startedAt', 'endedAt']
  });
}

// ----

function showTeamAtTime (docIndex, timelineIndex, teamId, now, cb) {
  let teamsAtTime = require('./team-at-time')(timelineIndex);
  timelineIndex.db.readStream({
    keys: false,
    lt: [now]
  })
    .on('data', bind(teamsAtTime, 'through'))
    .on('close', function () {
      let sum = function (acc, val) {
        return (acc || 0) + val;
      };

      let hours = teamsAtTime.teams.memberHoursByTeam.get(teamId) || new Map();
      let totalHours = arrayFrom(hours.values()).reduce(sum, 0);
      let members = teamsAtTime.teams.membersByTeam.get(teamId) || new Set();

      if (cb) {
        cb(null, {
          members: members,
          hours: hours,
          totalHours: totalHours
        });
      }
    });
}

// ----

module.exports = function getTimelineData (sourceIndex, teamId, ts, cb) {
  let docIndex = createDocIndex(sourceIndex);
  let timelineIndex = createTimelineIndex(docIndex);

  timelineIndex.catchup();
  showTeamAtTime(docIndex, timelineIndex, teamId, ts, cb);
};
