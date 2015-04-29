'use strict';

const cuid = require('cuid');
const validator = require('./util/validation');

function addEntry (db, data, cb) {

  if (!validator.isValidDbKey(data._id, data._type)) {
    let err = new Error('ID and Type can only have letters, numbers and dashes.');
    return cb(err);
  }

  const key = cuid();
  db.put(key, data, cb);
}

module.exports = addEntry;
