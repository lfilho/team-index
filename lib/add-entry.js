'use strict';

let cuid = require('cuid');

function addEntry (db, data, cb) {
  const key = cuid();
  db.put(key, data, cb);
}

module.exports = addEntry;
