const React = require('react/addons');
const TestUtils = React.addons.TestUtils;
const tape = require('tape');
const jsdom = require('jsdom');

const Wiki = require('../../frontend/components/wiki/wiki');

function setupDom (cb) {
  const config = {
    html: '<!doctype html><head></head><body></body></html>',
    done: function (err, window) {
      if (err) { throw err; }

      global.window = window;
      global.document = window.document;

      cb();
    }
  };
  jsdom.env(config);
}

function findEditButton (inst) {
  const buttons = TestUtils.scryRenderedDOMComponentsWithTag(inst, 'button');
  return buttons.filter(function (b) {
    return b.props.name === 'edit';
  })[0];
}

function findDocHeading (inst) {
  return TestUtils.findRenderedDOMComponentWithTag(inst, 'h1');
}

setupDom(function () {
  tape('display a doc', function (t) {
    const doc = { _id: 'testDoc', _type: 'test' };
    const props = {
      id: doc._id,
      doc: doc,
      actionCallback: function () {
        throw new Error('expected no actions');
      }
    };

    const inst = TestUtils.renderIntoDocument(<Wiki {...props} />);

    const editButton = findEditButton(inst);
    t.ok(editButton, 'View mode displays an Edit button');

    const heading = findDocHeading(inst);
    t.ok(heading.props.children.indexOf(doc._id) >= 0, 'Doc ID is displayed in the heading');

    t.end();
  });

  tape('load a doc', function (t) {
    t.plan(3);

    const id = 'testDoc';
    const props = {
      id: id,
      actionCallback: function (type, args) {
        t.equal(type, 'wikiLoad', 'wikiLoad action is triggered');
        t.equal(args.id, id, 'Correct ID is loaded');
      }
    };

    const inst = TestUtils.renderIntoDocument(<Wiki {...props} />);

    const msg = TestUtils.findRenderedComponentWithType(inst, Wiki.LoadingMsg);
    t.ok(msg, 'LoadingMsg component is rendered');

    t.end();
  });
});
