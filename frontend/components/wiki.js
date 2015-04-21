var React = require('react');
var archieml = require('archieml');

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
    this.props.actionCallback('wikiLoad', { id });

    // populate the form immediately, in case we already have the doc in memory
    this.populateForm(id, this.props);
  },

  onClickCancel: function (event) {
    event.preventDefault();
    this.setState({ id: null });
  },

  onClickSave: function (event) {
    event.preventDefault();

    var id = this.state.id;
    var type = this.refs.typeField.getDOMNode().value.trim();
    var body = this.state.body;
    this.props.actionCallback('wikiSave', { id, type, body });
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.docs) {
      this.populateForm(this.state.id, nextProps);
    }
  },

  onChangeBody: function (event) {
    var body = event.target.value.trim();
    this.setState({ body });
  },

  onChangeType: function (event) {
    var type = event.target.value.trim();
    this.setState({ type });
  },

  render: function () {
    var id = this.state.id;
    var isLoaded = id && this.props.docs.hasOwnProperty(id);
    var doc = isLoaded && this.props.docs[id];
    var isLoading = id && !doc;
    var exists = doc && doc._type;
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
          <input ref="idField" name="id" placeholder="ID" autoFocus={true} defaultValue={id} readOnly={!!exists} />
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
