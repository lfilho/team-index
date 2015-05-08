'use strict';

/*

Data import
====

Use this script to import data from an ndjson file into the db.

*/

const config = require('../config');

const fs = require('fs');
const bind = require('bind-fn');
const addEntry = require('../lib/add-entry');

const argv = require('minimist')(process.argv.slice(2));
const sourceFilename = argv.source;

if (!sourceFilename) {
  console.log('Usage: iojs import.js --source=SOURCE_FILENAME');
  process.exit();
}

require('../lib/setup-db')({ dbFile: config.dataDbFile }, function (err, db, docIndex) {
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
