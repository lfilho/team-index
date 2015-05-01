const React = require('react');
const isValidDbKey = require('../../../lib/validate-db-key');
const convertDocToArchie = require('../../../lib/doc-to-archie');
const Preview = require('./preview');

const UNSAVED_CHANGES_MESSAGE = 'There are unsaved changes to the doc.\nDiscard them?';

function createState (id, props) {
  let state = {
    body: null,
    loading: true,
    editing: false
  };

  const doc = props.docs[id];
  if (!doc) { return state; }

  state.loading = false;
  state.body = convertDocToArchie(doc);
  return state;
}

module.exports = React.createClass({
  propTypes: {
    actionCallback: React.PropTypes.func.isRequired,
    docs: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return createState(this.props.id, this.props);
  },

  populateForm: function (id, props) {
    this.setState(createState(id, props));
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

    const newState = {
      editing: false
    };

    if (this.state.hasChanged) {
      const doc = this.props.docs[this.props.id];
      const body = convertDocToArchie(doc);
      newState.body = body;
    }

    this.setState(newState);
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

  getFieldValue: function (ref) {
    return this.refs[ref].getDOMNode().value;
  },

  onSubmitCreate: function (event) {
    event.preventDefault();

    const id = this.getFieldValue('idField');
    const type = this.getFieldValue('typeField');

    const self = this;
    this.props.actionCallback('wikiSave', { id, type }, function (err) {
      if (err) { return alert('Error: Failed to create the doc'); }

      self.props.actionCallback('wikiLoad', { id });
    });
  },

  _renderHeaderButtons: function () {
    if (this.state.editing) {
      const cancelLabel = this.state.hasChanged ? 'Cancel' : 'Close';
      return [
        <button key="cancel" type="reset" onClick={this.onClickCancel}>{cancelLabel}</button>,
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

  _renderCreateForm: function () {
    const typeOptions = ['wikiPage', 'person', 'team', 'teamMembership'].map(function (type, i) {
      return <option key={i} value={type}>{type}</option>;
    });

    return (
      <div className="wiki">
        <form className="create" onSubmit={this.onSubmitCreate}>
          <h2>Create a doc</h2>
          <div>
            <input name="id" placeholder="ID" ref="idField" defaultValue={this.props.id} />
          </div>
          <div>
            <select name="type" ref="typeField">
              <option value="">- Choose a Type -</option>
              {typeOptions}
            </select>
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    );
  },

  render: function () {
    const id = this.props.id;
    if (this.state.loading) {
      return (
        <div className="wiki">
          ..loading ({id})..
        </div>
      );
    }

    const exists = !!this.props.docs[id];
    if (!exists) {
      return this._renderCreateForm();
    }

    const doc = this.props.docs[id];
    const headerButtons = this._renderHeaderButtons();
    const editForm = this._renderEditForm();

    return (
      <div className="wiki">
        <h1>
          {id}
          <span className="type">{doc._type}</span>
          <span className="buttons">{headerButtons}</span>
        </h1>

        {editForm}

        <Preview body={this.state.body} id={doc._id} type={doc._type} actionCallback={this.props.actionCallback} />
      </div>
    );
  }
});
