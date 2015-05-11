'use strict';

const convertArchieToDoc = require('../../../lib/archie-to-doc');
const marked = require('marked');
const moment = require('moment');
const React = require('react');
const WikiLink = require('./wiki-link');
const DataPreview = require('./data-preview');

module.exports = {
  _default: function (props, cb) {
    // convert body to json and back again, so we only preview valid stuff
    let parsed = convertArchieToDoc(props.body);

    const preview = (
      <DataPreview data={parsed} />
    );

    cb(null, preview);
  },

  // wikiPage renders the ".body" value as markdown
  wikiPage: function (props, cb) {
    // convert body to json and back again, so we only preview valid stuff
    let parsed = convertArchieToDoc(props.body);

    const pageBody = parsed.body && { __html: marked(parsed.body) };
    const bodyElem = pageBody && <div dangerouslySetInnerHTML={pageBody}/>;
    delete parsed.body;

    const preview = (
      <div>
        {bodyElem}
        <DataPreview data={parsed} />
      </div>
    );

    cb(null, preview);
  },


  // team docs give you a list of members
  team: function (props, cb) {
    props.actionCallback('loadTeamMembers', { teamId: props.id }, function (err, res) {
      if (err) { return cb(err); }

      const memberElems = res.members.map(function (m) {
        const now = Date.now();
        const start = parseInt(m.startedAt || 0, 10);
        const end = m.endedAt ? parseInt(m.endedAt, 10) : Infinity;
        const isActive = (now > start && now < end);
        const className = isActive ? 'active' : 'inactive';
        return (
          <tr key={m._id} className={className}>
            <td><WikiLink id={m._id}>{m.person}</WikiLink></td>
            <td>{m.hoursPerWeek}</td>
            <td>{isActive ? 'yes' : 'no'}</td>
          </tr>
        );
      });

      const preview = (
        <div>
          <h2>Team members</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Hours per week</th>
                <th>Active?</th>
              </tr>
            </thead>
            <tbody>
              {memberElems}
            </tbody>
          </table>
        </div>
      );

      cb(null, preview);
    });
  },


  // teamMembership docs link to the team and the person
  teamMembership: function (props, cb) {
    // convert body to json and back again, so we only preview valid stuff
    let parsed = convertArchieToDoc(props.body);

    const personId = parsed.person;
    const teamId = parsed.team;
    delete parsed.person;
    delete parsed.team;

    // format dates
    ['startedAt', 'endedAt'].forEach(function (key) {
      if (!parsed.hasOwnProperty(key)) { return; }

      const val = parsed[key];
      if (typeof val !== 'number') { return; }
      if (val === 0) { return; }

      parsed[key] = moment(val).format('MMMM Do YYYY, h:mm:ss a');
    });

    const preview = (
      <div>
        <div>Membership of <WikiLink id={personId} /> in the <WikiLink id={teamId} /> team.</div>

        <DataPreview data={parsed} />
      </div>
    );

    cb(null, preview);
  }
};
