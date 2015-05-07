'use strict';

const st = require('st');

function addRoutes (router, config) {
  const baseUri = '/static';
  const serveStaticFile = st({
    path: config.dir,
    cache: config.cacheEnabled,
    url: baseUri
  });

  router.addRoute(baseUri + '/*', serveStaticFile);

  router.addRoute('/favicon.ico', function (req, res) {
    req.url = '/static/favicon.ico';
    return serveStaticFile(req, res);
  });
}

module.exports = addRoutes;
