// TODO: as an optimisation we can initialize with the set of docs, rather than reading doc entries 1 by 1.  Only need to read doc entries for updates that come after our first catchup
// TODO: do leveldb batch operations

const Fingdex = require('fingdex');
const level = require('level');

module.exports = function (docIndex, fieldsByType) {
  fieldsByType = fieldsByType || {};

  // create a timeline of all events (inferred from docs)
  const timeline = new Fingdex(docIndex);

  timeline.docIndex = docIndex;

  timeline.db = level({
    db: require('memdown'),
    keyEncoding: require('bytewise'),
    valueEncoding: 'json'
  });

  timeline.through = function (entry) {
    var self = this;
    var type = entry._type;

    // ignore the doc if we don't have fields for that type
    var fields = fieldsByType[type];
    if (!fields) { return; }

    var docId = entry._id;
    var doc = docIndex.getDoc(docId);
    var changes = entry.isNew ? doc : entry.changes;
    var prev = entry.prev || {};

    // extract relevant fields, based on doc type
    var events = fields.map(function (field) {
      var ts = changes[field];
      var prevTs = prev[field];

      // ignore if there's no value
      if (ts === undefined) { return; }

      // ignore invalid timestamp
      ts = parseInt(ts, 10);
      if (isNaN(ts)) { return; }

      return {
        ts: ts,
        prevTs: prevTs,
        docId: docId,
        docType: type,
        field: field
      };
    }).filter(Boolean);

    // add events to the result stream and udpate the db
    events.forEach(function (event) {
      self.emitChange(event);

      // update the db
      self.updateDb(event);
    });
  };

  function createDbKey (ts, docId, field) {
    return [ts, docId, field];
  }

  timeline.updateDb = function (event) {
    // delete the old event
    if (event.prevTs !== undefined) {
      var prevKey = createDbKey(event.prevTs, event.docId, event.field);
      this.db.del(prevKey);
    }

    // add the new event
    var key = createDbKey(event.ts, event.docId, event.field);
    this.db.put(key, {
      docType: event.docType,
      docId: event.docId,
      ts: event.ts,
      field: event.field
    });
  };

  return timeline;
};
