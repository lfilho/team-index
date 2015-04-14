var http = require('http');
var Router = require('routes');
var url = require('url');

function createServer () {
  var router = new Router();

  var server = http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    var match = router.match(path);

    if (match) {
      match.fn(req, res, match);
    }
    else {
      res.writeHead(404);
      res.end('not found');
    }
  });

  server.router = router;
  return server;
}

module.exports = createServer;
