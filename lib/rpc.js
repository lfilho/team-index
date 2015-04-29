'use strict';

const once = require('once');
const addEntry = require('./add-entry');

module.exports = function (db, indexRegistry) {
  const docIndex = indexRegistry.get('docs');
  const timelineIndex = indexRegistry.get('timeline');

  return {
    entries: {
      read: function (onData, cb) {
        cb = once(cb);

        db.readStream({
          keys: true,
          limit: 10
        })
          .on('data', onData)
          .on('close', cb)
          .on('error', cb);
      },

      add: function (data, cb) {
        addEntry(db, data, cb);
      }
    },

    docs: {
      get: function (id, cb) {
        docIndex.catchup();

        const doc = docIndex.getDoc(id);
        if (!doc) {
          let err = new Error('doc not found');
          err.statusCode = 404;
          return cb(err);
        }

        cb(null, doc);
      }
    },

    timeline: {
      getDataPoints: function (from, to, cb) {
        require('./timeline-data-points')(docIndex, timelineIndex, from, to, cb);
      }
    },

    indexes: {
      getSnapshot: function (name, cb) {
        const index = indexRegistry.get(name);

        if (!index) {
          let err = new Error('index not found');
          err.statusCode = 404;
          return cb(err);
        }

        index.catchup();
        return cb(null, index.getSnapshot());
      },

      getChangesSince: function (name, sinceCuid, cb) {
        const index = indexRegistry.get(name);

        if (!index) {
          let err = new Error('index not found');
          err.statusCode = 404;
          return cb(err);
        }

        index.catchup();
        return cb(null, index.getChangesSince(sinceCuid));
      },

      getSourceChangesSince: function (name, sinceCuid, cb) {
        const index = indexRegistry.get(name);

        if (!index) {
          let err = new Error('index not found');
          err.statusCode = 404;
          return cb(err);
        }

        const source = index.source;
        if (!source) {
          let err = new Error('index source not found');
          err.statusCode = 404;
          return cb(err);
        }

        source.catchup();
        return cb(null, source.getChangesSince(sinceCuid));
      }
    }
  };
};
