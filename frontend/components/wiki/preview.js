'use strict';

const React = require('react');
const customPreviewers = require('./custom-previewers');

module.exports = React.createClass({
  propTypes: {
    actionCallback: React.PropTypes.func.isRequired,
    body: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      preview: null
    };
  },

  loadPreview: function (props) {
    const self = this;
    const func = customPreviewers[props.type];

    if (!func) {
      this.setState({ preview: <pre>{props.body}</pre> });
      return;
    }

    func(props, function (err, preview) {
      if (err) { return console.error(err); }

      self.setState({ preview });
    });
  },

  componentWillMount: function () {
    this.loadPreview(this.props);
  },

  componentWillReceiveProps: function (nextProps) {
    this.loadPreview(nextProps);
  },

  render: function () {
    return (
      <div className="preview">
      {this.state.preview}
      </div>
    );
  }
});
