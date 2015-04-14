'use strict';

let bind = require('bind-fn');
let Fingdex = require('fingdex');
let hooks = require('level-hooks');
let levelup = require('levelup');
let leveldown = require('leveldown');

function setup (opts, cb) {
  let docIndex = Fingdex.createDocIndex();

  let db = levelup(opts.dbFile, {
    db: leveldown,
    keyEncoding: require('bytewise'),
    valueEncoding: 'json'
  });

  hooks(db);

  // feed inserts into docIndex
  db.hooks.pre(function (change, add) {
    if (change.type === 'put') {
      docIndex.through(change.value);
    }
    else {
      console.log('pre hook!', change);
    }
  });

  // restore the doc index from logs
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
