var React = require('react');
var archieml = require('archieml');
var validator = require('../../lib/util/validation');

const UNSAVED_CHANGES_MESSAGE = 'There are unsaved changes to the doc.\nDiscard them?';

function convertDocToArchie (doc) {
  var lines = Object.keys(doc).map(function (key) {
    // ignore reserved keys
    if (key[0] === '_') { return; }

    return key + ': ' + doc[key];
  });

  return lines.filter(Boolean).join('\n');
}

function generatePreview (doc, body) {
  // convert body to json and back again, so we only preview valid stuff
  var parsed = archieml.load(body);
  var preview = convertDocToArchie(parsed);

  return (
    <div>
      <h1>{doc._id}</h1>
      <pre>{preview}</pre>
    </div>
  );
}

module.exports = React.createClass({
  getInitialState: function () {
    return {
      id: null,
      body: null,
      type: null
    };
  },

  populateForm: function (id, props) {
    var doc = props.docs[id];
    if (!doc) {
      return this.setState({ id });
    }

    var type = doc._type;
    var body = convertDocToArchie(doc);
    this.setState({ id, body, type });

    // also need to overwrite the dom value directly
    var ref = this.refs.bodyField;
    if (ref) { ref.getDOMNode().value = body; }
  },

  onClickLoad: function (event) {
    event.preventDefault();
    var id = this.refs.idField.getDOMNode().value.trim();

    if (!validator.isValidDbKey(id)) {
      alert('ID can only have letters, numbers and dashes.');
      return;
    }

    this.props.actionCallback('wikiLoad', { id });

    // populate the form immediately, in case we already have the doc in memory
    this.populateForm(id, this.props);
  },

  onClickCancel: function (event) {
    event.preventDefault();
    let shouldCancel = !this.hasChanged || (this.hasChanged && confirm(UNSAVED_CHANGES_MESSAGE));
    if (shouldCancel) {
      this.setState({ id: null });
    }
  },

  onClickSave: function (event) {
    event.preventDefault();

    var id = this.state.id;
    var type = this.refs.typeField.getDOMNode().value.trim();
    var body = this.state.body;

    if (!validator.isValidDbKey(id, type)) {
      alert('ID and Type can only have letters, numbers and dashes.');
      return;
    }

    this.props.actionCallback('wikiSave', { id, type, body }, function (err) {
      if (err) { return alert('Error: Failed to save the doc'); }
      alert('Saved');
    });
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.docs) {
      this.populateForm(this.state.id, nextProps);
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
    if (this.hasChanged) {
      let event = e || window.event;
      event.returnValue = UNSAVED_CHANGES_MESSAGE;
      return event.returnValue;
    }
  },

  onChangeBody: function (event) {
    var body = event.target.value.trim();
    this.setState({ body });
    this.hasChanged = true;
  },

  onChangeType: function (event) {
    var type = event.target.value.trim();
    this.setState({ type });
    this.hasChanged = true;
  },

  render: function () {
    var id = this.state.id;
    var isLoaded = id && this.props.docs.hasOwnProperty(id);
    var doc = isLoaded && this.props.docs[id];
    var isLoading = id && !doc;
    var exists = doc && doc._type;

    var idField = <input ref="idField" name="id" placeholder="ID" autoFocus={true} defaultValue={id} readOnly={!!exists} />
    var typeField = doc && <input ref="typeField" name="type" placeholder="Type" value={this.state.type} onChange={this.onChangeType} readOnly={!!exists} />;
    var bodyField;

    var preview;

    if (doc) {
      bodyField = <textarea ref="bodyField" name="body" defaultValue={this.state.body} onChange={this.onChangeBody}></textarea>;
      preview = generatePreview(doc, this.state.body);
    }

    var buttons;
    if (doc) {
      buttons = (
        <div className="buttons">
          <button type="reset" name="cancel" onClick={this.onClickCancel}>Cancel</button>
          <button type="submit" name="save" onClick={this.onClickSave} disabled={!this.state.type}>Save</button>
        </div>
      );
    }
    else {
      buttons = (
        <div className="buttons">
          <button name="load" onClick={this.onClickLoad}>Load</button>
        </div>
      );
    }

    return (
      <div className="wiki">
        <form className="edit">
          {idField}
          {typeField}
          {bodyField}

          {buttons}
        </form>
        <div className="preview">
          {preview}
        </div>
      </div>
    );
  }
});
