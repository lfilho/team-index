var http = require('http');
var Router = require('routes-router');

function createServer () {
  var router = new Router();
  var server = http.createServer(router);

  server.router = router;
  return server;
}

module.exports = createServer;
