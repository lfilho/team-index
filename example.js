'use strict';

let Fingdex = require('fingdex');
let fs = require('fs');
let bind = require('bind-fn');
let arrayFrom = require('./lib/array-from');

let argv = require('minimist')(process.argv.slice(2));
let sourceFilename = argv.source;
let teamId = argv.team;
let ts = argv.ts;

if (!sourceFilename || !teamId || !ts) {
  console.log('Usage: iojs . --source=SOURCE_FILENAME --team=TEAM_ID --ts=TIMESTAMP');
  process.exit();
}

let sourceIndex = new Fingdex();
fs.readFileSync(sourceFilename, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map(JSON.parse)
  .forEach(bind(sourceIndex, 'append'));

require('./lib/get-timeline-data')(sourceIndex, teamId, ts, function (err, res) {
  if (err) { throw err; }
  console.log('\nWho is in the %s team @ %s?\n', teamId, new Date(ts), arrayFrom(res.members));
  console.log('Total dev hours per week: %d\n', res.totalHours, arrayFrom(res.hours));
});
