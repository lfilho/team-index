'use strict';

const archieml = require('archieml');
const convertDocToArchie = require('../../../lib/doc-to-archie');
const marked = require('marked');
const React = require('react');
const WikiLink = require('../wiki-link');

module.exports = {
  // wikiPage renders the ".body" value as markdown
  wikiPage: function (props, cb) {
    // convert body to json and back again, so we only preview valid stuff
    let parsed = archieml.load(props.body);

    const pageBody = parsed.body && { __html: marked(parsed.body) };
    delete parsed.body;
    const extraData = convertDocToArchie(parsed);

    const preview = (
      <div>
        <div dangerouslySetInnerHTML={pageBody}/>

        <h2>Extra data</h2>
        <pre>{extraData}</pre>
      </div>
    );

    cb(null, preview);
  },


  // team docs give you a list of members
  team: function (props, cb) {
    props.actionCallback('loadTeamMembers', { teamId: props.id }, function (err, res) {
      if (err) { return cb(err); }

      const memberElems = res.members.map(function (m) {
        return (
          <tr key={m._id}>
            <td><WikiLink id={m._id}>{m.person}</WikiLink></td>
            <td>{m.hoursPerWeek}</td>
          </tr>
        );
      });

      const preview = (
        <div>
          <h2>Team members</h2>
          <table>
            <tr>
              <th>Name</th>
              <th>Hours per week</th>
            </tr>

            {memberElems}
          </table>
        </div>
      );

      cb(null, preview);
    });
  },


  // teamMembership docs link to the team and the person
  teamMembership: function (props, cb) {
    // convert body to json and back again, so we only preview valid stuff
    let parsed = archieml.load(props.body);

    const personId = parsed.person;
    const teamId = parsed.team;
    delete parsed.person;
    delete parsed.team;
    const extraData = convertDocToArchie(parsed);

    const preview = (
      <div>
        <div>Person: <WikiLink id={personId} /></div>
        <div>Team: <WikiLink id={teamId} /></div>

        <pre>{extraData}</pre>
      </div>
    );

    cb(null, preview);
  }
};
