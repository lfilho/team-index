var React = require('react');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      id: null
    };
  },

  onClickLoad: function (event) {
    event.preventDefault();
    var id = this.refs.idField.getDOMNode().value.trim();
    this.props.actionCallback('wikiLoad', { id: id });

    this.setState({ id: id });
  },

  onChangeBody: function (event) {

  },

  render: function () {
    console.log('render: Wiki', this.props);

    var body;
    var doc;
    var isLoading = false;
    var id = this.state.id;
    var typeField;
    var bodyField;

    if (id) {
      doc = this.props.docs[id];
      if (!doc) {
        isLoading = true;
        body = '';
      }
      else {
        body = JSON.stringify(doc);
        typeField = <input name="type" placeholder="Type" value={doc._type} readOnly={!!doc._type} />;
        bodyField = <textarea name="body" defaultValue={body} onChange={this.onChangeBody}></textarea>;
      }
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
        preview goes here...
        </div>
      </div>
    );
  }
});
