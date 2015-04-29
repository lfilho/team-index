'use strict';

let st = require('st');

function addRoutes (router, config) {
  var baseUri = '/static';
  router.addRoute(baseUri + '/*', st({
    path: config.dir,
    cache: config.cacheEnabled,
    url: baseUri
  }));
}

module.exports = addRoutes;
