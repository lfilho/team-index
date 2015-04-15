'use strict';

let h = require('hyperscript');

module.exports = function (contentElems) {
  const cssPath = 'static/css/main.css';
  const jsPath = 'static/dist/main.js';

  const cssElem = h('link', { href: cssPath, rel: 'stylesheet', type: 'text/css' });
  const jsElem = h('script', { src: jsPath });

  return h('html', [
    h('head', {}, [
      h('meta', { name: 'viewport', content: 'width=device-width' }),
      cssElem,
    ]),
    h('body', {}, [
      h('.content', contentElems || []),
      jsElem
    ])
  ]);
};
