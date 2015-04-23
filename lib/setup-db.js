'use strict';

let bind = require('bind-fn');
let Fingdex = require('fingdex');
let hooks = require('level-hooks');
let levelup = require('levelup');
let leveldown = require('leveldown');

/*

Database
====

The leveldb instance `db` is a time-ordered stream of log entries, where each entry describes a state update.

Along with the leveldb we have a docIndex, which aggregates the log entries into documents.

*/
function setup (opts, cb) {
  // default values for documents, by type
  let docDefaults = {};

  docDefaults.team = {
    startedAt: 0
  };

  docDefaults.teamMembership = {
    startedAt: 0,
    hoursPerWeek: 40
  };

  let docIndex = Fingdex.createDocIndex(undefined, docDefaults);

  let db = levelup(opts.dbFile, {
    db: leveldown,
    keyEncoding: require('bytewise'),
    valueEncoding: 'json'
  });

  /*

  Hooks
  ----

  We use a pre-hook so that whenever a new log entry is inserted, we can feed that into the doc index.

  */
  hooks(db);
  db.hooks.pre(function (change, add) {
    if (change.type === 'put') {
      docIndex.through(change.value);
    }
    // - TODO: handle other change types
    else {
      console.log('pre hook!', change);
    }
  });

  /*

  Initializing the doc index
  ----

  On startup we feed all log entries into the doc index.

  - TODO: once we get a large set of entries we'll want to optimise this by
  restoring a docIndex snapshot, and just catching up from there.

   */
  db.readStream({
    keys: false
  })
    .on('data', bind(docIndex, 'through'))
    .on('close', function () {
      cb(null, db, docIndex);
    })
    .on('error', function (err) {
      cb(err);
    });
}

module.exports = setup;
