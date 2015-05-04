'use strict';

/*

Data import
====

Use this script to import data from an ndjson file into the db.

*/

const config = require('./config');

let fs = require('fs');
let bind = require('bind-fn');
let argv = require('minimist')(process.argv.slice(2));
let sourceFilename = argv.source;

if (!sourceFilename) {
  console.log('Usage: iojs import.js --source=SOURCE_FILENAME');
  process.exit();
}

let addEntry = require('./lib/add-entry');
require('./lib/setup-db')({ dbFile: config.dataDbFile }, function (err, db, docIndex) {
  if (err) { throw err; }

  fs.readFileSync(sourceFilename, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(JSON.parse)
    .forEach(function (data) {
      addEntry(db, data, function (err) {
        if (err) { throw err; }
      });
    });
});
