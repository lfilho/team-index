'use strict';

let Fingdex = require('fingdex');
let bind = require('bind-fn');
let arrayFrom = require('./lib/array-from');

// ----
// create a source for log entries

let sourceIndex = new Fingdex();
let fs = require('fs');
fs.readFileSync(__dirname + '/raw-entries.ndjson', 'utf8')
  .split('\n')
  .filter(Boolean)
  .map(JSON.parse)
  .forEach(bind(sourceIndex, 'addEntry'));

// ----
// create an index that will aggregate entries into docs

let docDefaults = {};

docDefaults.team = {
  startedAt: 0
};

docDefaults.teamMembership = {
  startedAt: 0,
  hoursPerWeek: 40
};

let docIndex = require('fingdex/lib/doc-index')(sourceIndex, docDefaults);

// ----
// create an index that infer a timeline of events from docs


let timelineHandlers = {};

timelineHandlers.team = function (entry) {
  // for teams we record events of when the team started or ended
  return ['startedAt', 'endedAt'];
};

timelineHandlers.teamMembership = function (entry) {
  // for team memberships we record events of when the membership started or ended
  return ['startedAt', 'endedAt'];
};

let timelineIndex = require('./lib/timeline-index')(docIndex, timelineHandlers);

// ----

function showTeamAtTime (teamId, now, cb) {
  let teamsAtTime = require('./lib/team-at-time')(docIndex, timelineIndex);
  timelineIndex.db.readStream({
    keys: false,
    lt: [now]
  })
    .on('data', bind(teamsAtTime, 'processEvent'))
    .on('close', function () {
      let sum = function (acc, val) {
        return (acc || 0) + val;
      };

      let hours = teamsAtTime.teams.memberHoursByTeam.get(teamId);
      let totalHours = arrayFrom(hours.values()).reduce(sum);

      console.log('\nWho is in the %s team @ %s?\n', teamId, new Date(now), arrayFrom(teamsAtTime.teams.membersByTeam.get(teamId)));
      console.log('Total dev hours per week: %d\n', totalHours, arrayFrom(hours));

      if (cb) { cb(); }
    });
}

// ----

let argv = require('minimist')(process.argv.slice(2));
let teamId = argv.team;
let ts = argv.ts;

if (!teamId || !ts) {
  console.log('Usage: iojs . --team=TEAM_ID --ts=TIMESTAMP');
  process.exit();
}

timelineIndex.catchup();
console.log('\nInfo about %s:', teamId, docIndex.getDoc(teamId));
showTeamAtTime(teamId, ts);
