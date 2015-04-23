var Fingdex = require('fingdex');
var Teams = require('./team-aggregator');

module.exports = function (timelineIndex) {
  var index = new Fingdex(timelineIndex);
  var docIndex = timelineIndex.docIndex;

  index.teams = new Teams();

  index.through = function (event) {
    var doc = docIndex.getDoc(event.docId);

    switch (doc._type) {
    case 'team':
      switch (event.field) {
      case 'startedAt':
        this.teams.addTeam(doc._id);
        break;

      case 'endedAt':
        this.teams.removeTeam(doc._id);
        break;

      default:
        console.error('Unknown field:', event.field);
        break;
      }
      break;

    case 'teamMembership':
      switch (event.field) {
      case 'startedAt':
        this.teams.addPersonToTeam(doc.person, doc.team);
        this.teams.setHoursPerWeek(doc.person, doc.team, doc.hoursPerWeek);
        break;

      case 'endedAt':
        this.teams.removePersonFromTeam(doc.person, doc.team);
        break;

      default:
        console.error('Unknown field:', event.field);
        break;
      }
      break;

    default:
      console.error('Unknown event:', event);
      break;
    }
  };

  return index;
};
