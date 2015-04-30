'use strict';

const once = require('once');
const addEntry = require('./add-entry');
const arrayFrom = require('./array-from');
const bind = require('bind-fn');
const Fingdex = require('fingdex');

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

    teams: {
      get: function (teamId, cb) {
        const teamDoc = docIndex.getDoc(teamId);
        if (!teamDoc || teamDoc._type !== 'team') {
          cb(new Error('not a valid team doc'));
        }

        // TODO: cache the fingdex instead of recreating it from scratch every time
        const teamIndex = new Fingdex(docIndex);

        teamIndex.memberships = new Set();
        teamIndex.through = function (entry) {
          // only index new docs
          if (!entry.isNew) { return; }

          // only index teamMembership docs
          if (entry._type !== 'teamMembership') { return; }

          const doc = docIndex.getDoc(entry._id);

          // only index docs for the requested team
          if (doc.team !== teamId) { return; }

          teamIndex.memberships.add(doc._id);
        };

        teamIndex.catchup();
        cb(null, {
          members: arrayFrom(teamIndex.memberships).map(bind(docIndex, 'getDoc'))
        });
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
