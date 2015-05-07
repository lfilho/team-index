const Teams = require('./team-aggregator');

module.exports = function (docIndex) {
  const index = {};
  index.teams = new Teams();

  index.through = function (event) {
    const doc = docIndex.getDoc(event.docId);

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
