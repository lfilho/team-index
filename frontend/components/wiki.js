const React = require('react');
const archieml = require('archieml');
const marked = require('marked');
const isValidDbKey = require('../../lib/validate-db-key');

const UNSAVED_CHANGES_MESSAGE = 'There are unsaved changes to the doc.\nDiscard them?';

function convertDocToArchie (doc) {
  var lines = Object.keys(doc).map(function (key) {
    // ignore reserved keys
    if (key[0] === '_') { return; }

    const val = doc[key];
    return key + ': ' + val + (val.indexOf('\n') > 0 ? '\n:end' : '');
  });

  return lines.filter(Boolean).join('\n');
}

function generatePreview (doc, body) {
  // convert body to json and back again, so we only preview valid stuff
  let parsed = archieml.load(body);

  // wikiPage renders the ".body" value as markdown
  if (doc._type === 'wikiPage') {
    const pageBody = parsed.body && { __html: marked(parsed.body) };
    delete parsed.body;
    const preview = convertDocToArchie(parsed);

    return (
      <div>
        <div dangerouslySetInnerHTML={pageBody}/>

        <h2>Extra data</h2>
        <pre>{preview}</pre>
      </div>
    );
  }

  const preview = convertDocToArchie(parsed);
  return (
    <pre>{preview}</pre>
  );
}

module.exports = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      body: null,
      editing: false
    };
  },

  populateForm: function (id, props) {
    var doc = props.docs[id];
    if (!doc) { return; }

    var body = convertDocToArchie(doc);
    this.setState({ body });
  },

  componentWillMount: function () {
    // start loading the current doc
    this.props.actionCallback('wikiLoad', { id: this.props.id });
  },

  componentWillReceiveProps: function (nextProps) {
    // start loading the new doc
    if (nextProps.id) {
      let action = nextProps.actionCallback || this.props.actionCallback;
      action('wikiLoad', { id: nextProps.id });
    }

    if (nextProps.docs) {
      this.populateForm(nextProps.id || this.props.id, nextProps);
    }
  },

  componentDidMount: function () {
    window.addEventListener('beforeunload', this.unloadListener);
  },

  componentWillUnmount: function () {
    window.removeEventListener('beforeunload', this.unloadListener);
  },

  // NOTE: Various mobile browsers will skip the confirmation prompt and unload anyway.
  // See: https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
  unloadListener: function (e) {
    if (this.state.hasChanged) {
      let event = e || window.event;
      event.returnValue = UNSAVED_CHANGES_MESSAGE;
      return event.returnValue;
    }
  },

  onChangeBody: function (event) {
    const body = event.target.value.trim();
    const hasChanged = true;

    this.setState({ body, hasChanged });
  },

  onClickEdit: function () {
    this.setState({ editing: true });
  },

  onClickCancel: function (event) {
    event.preventDefault();

    if (this.state.hasChanged && !confirm(UNSAVED_CHANGES_MESSAGE)) {
      return;
    }

    const doc = this.props.docs[this.props.id];
    const body = convertDocToArchie(doc);
    this.setState({
      editing: false,
      body: body
    });
  },

  onClickSave: function (event) {
    event.preventDefault();
    var self = this;

    const id = this.props.id;
    const body = this.state.body;

    this.props.actionCallback('wikiSave', { id, body }, function (err) {
      if (err) { return alert('Error: Failed to save the doc'); }

      alert('Saved');
      self.setState({ hasChanged: false });
    });
  },

  _renderHeaderButtons: function () {
    if (this.state.editing) {
      return [
        <button key="cancel" type="reset" onClick={this.onClickCancel}>Cancel</button>,
        <button key="save" type="submit" onClick={this.onClickSave}>Save</button>
      ];
    }

    return <button onClick={this.onClickEdit}>Edit</button>
  },

  _renderEditForm: function () {
    if (!this.state.editing) { return null; }

    return (
      <div className="edit">
        <textarea ref="bodyField" name="body" defaultValue={this.state.body} onChange={this.onChangeBody}></textarea>
      </div>
    );
  },

  render: function () {
    const id = this.props.id;
    const isLoaded = this.props.docs.hasOwnProperty(id);
    console.log('ID', id, isLoaded);

    if (!isLoaded) {
      return (
        <div className="wiki">
          ..loading ({id})..
        </div>
      );
    }

    const doc = isLoaded && this.props.docs[id];
    const headerButtons = this._renderHeaderButtons();
    const editForm = this._renderEditForm();
    const preview = generatePreview(doc, this.state.body);

    return (
      <div className="wiki">
        <h1>
          {id}
          <span className="type">{doc._type}</span>
          <span className="buttons">{headerButtons}</span>
        </h1>

        {editForm}

        <div className="preview">
          {preview}
        </div>
      </div>
    );
  }
});
