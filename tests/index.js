'use strict';

let tape = require('tape');

let Fingdex = require('fingdex');
let fs = require('fs');
let path = require('path');
let bind = require('bind-fn');
let arrayFrom = require('../lib/array-from');


let sourceFilename = path.join(__dirname, '..', 'test-entries.ndjson');
let teamId = 'ATeam';
let ts = 1428471352420;

let sourceIndex = new Fingdex();
fs.readFileSync(sourceFilename, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map(JSON.parse)
  .forEach(bind(sourceIndex, 'addEntry'));

tape('Example usage', function (t) {
  t.plan(5);

  require('../lib/get-timeline-data')(sourceIndex, teamId, ts, function (err, res) {
    t.deepEqual(arrayFrom(res.members), ['PersonOne', 'PersonTwo'], 'Correct people in team');
    t.equal(res.hours.size, 2, 'Hours map contains correct team members');
    t.equal(res.hours.get('PersonOne'), 40, 'Correct hours for team member');
    t.equal(res.hours.get('PersonTwo'), 40, 'Correct hours for team member');
    t.equal(res.totalHours, 80, 'Correct total hours');
  });
});

tape('Example usage, later in time', function (t) {
  t.plan(4);

  // get the timeline data 1 ms after (this should be the point at which PersonTwo leaves the team)
  require('../lib/get-timeline-data')(sourceIndex, teamId, ts+1, function (err, res) {
    t.deepEqual(arrayFrom(res.members), ['PersonOne'], 'Correct people in team');
    t.equal(res.hours.size, 1, 'Hours map contains correct team members');
    t.equal(res.hours.get('PersonOne'), 40, 'Correct hours for team member');
    t.equal(res.totalHours, 40, 'Correct total hours');
  });
});
