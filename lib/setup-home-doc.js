'use strict';

module.exports = function (homeDocId, docIndex, rpc) {
  docIndex.catchup();
  if (!docIndex.getDoc(homeDocId)) {
    rpc.entries.add({
      _id: homeDocId,
      _type: 'wikiPage',
      body: 'Welcome to the wiki!\n\nTry editing this page. Anything in the `body` value will be rendered as **markdown** in the preview.  Any other values are displayed in the "Extra Data" section.',
      foo: true,
      bar: false
    });
  }
};
