'use strict';

const cuid = require('cuid');
const isValidDbKey = require('./validate-db-key');

function addEntry (db, data, cb) {

  if (!isValidDbKey(data._id, data._type)) {
    let err = new Error('ID and Type can only have letters, numbers and dashes.');
    return cb(err);
  }

  const key = cuid();
  db.put(key, data, cb);
}

module.exports = addEntry;
