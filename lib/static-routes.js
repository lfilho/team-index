'use strict';

let st = require('st');

function addRoutes (router, config) {
  var baseUri = '/static';
  router.addRoute(baseUri + '/*', st({
    path: config.dir,
    url: baseUri
  }));
}

module.exports = addRoutes;
