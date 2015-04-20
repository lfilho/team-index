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
      body: null
    };
  },

  onClickLoad: function (event) {
    event.preventDefault();
    var id = this.refs.idField.getDOMNode().value.trim();
    this.props.actionCallback('wikiLoad', { id: id });

    this.setState({ id: id });
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.docs) {
      let doc = nextProps.docs[this.state.id];
      if (doc) {
        this.setState({ body: convertDocToArchie(doc) });
      }
    }
  },

  onChangeBody: function (event) {
    var body = this.refs.bodyField.getDOMNode().value.trim();
    this.setState({ body: body });
  },

  render: function () {
    var doc;
    var isLoading = false;
    var id = this.state.id;
    var typeField;

    if (id) {
      doc = this.props.docs[id];
      if (!doc) {
        isLoading = true;
      }
      else {
        typeField = <input name="type" placeholder="Type" value={doc._type} readOnly={!!doc._type} />;
      }
    }

    var bodyField;
    var preview;

    if (this.state.body) {
      bodyField = <textarea ref="bodyField" name="body" defaultValue={this.state.body} onChange={this.onChangeBody}></textarea>;
      preview = generatePreview(doc, this.state.body);
    }

    return (
      <div className="wiki">
        <form className="edit">
          <input ref="idField" name="id" placeholder="ID" autoFocus={true} defaultValue={id} />
          <button name="load" onClick={this.onClickLoad}>Load</button>

          {typeField}
          {bodyField}
        </form>
        <div className="preview">
          {preview}
        </div>
      </div>
    );
  }
});
