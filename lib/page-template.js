'use strict';

let h = require('hyperscript');

module.exports = function (contentElems) {
  const cssPath = 'static/dist/main.css';
  const jsPath = 'static/dist/main.js';

  const cssElem = h('link', { href: cssPath, rel: 'stylesheet', type: 'text/css' });
  const jsElem = h('script', { src: jsPath });

  const fontElem = h('link', {
    href: '//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,700,300,600,400',
    rel: 'stylesheet',
    type: 'text/css'
  });

  return h('html', [
    h('head', {}, [
      h('meta', { charset: 'utf-8' }),
      h('title', 'Dashboard'),
      h('meta', { name: 'robots', content: 'noindex' }),
      h('meta', { name: 'viewport', content: 'width=device-width' }),
      fontElem,
      cssElem
    ]),
    h('body', {}, [
      h('.content', contentElems || []),
      jsElem
    ])
  ]);
};
