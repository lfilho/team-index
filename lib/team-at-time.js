var Fingdex = require('fingdex');
var Teams = require('./team-aggregator');

module.exports = function (docIndex, timelineIndex) {
  var index = new Fingdex(timelineIndex);
  index.teams = new Teams();

  index.addEntry = function (event) {
    this.processEvent(event);
  };

  index.processEvent = function (event) {
    var doc = docIndex.getDoc(event._id);

    switch (doc._type) {
    case 'team':
      switch (event.field) {
      case 'startedAt':
        this.teams.addTeam(doc._id);
        break;

      case 'endedAt':
        this.temas.removeTeam(doc._id);
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
