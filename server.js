var Hapi = require('hapi');
var Boom = require('boom');

var Path = require('path');
var Plates = require('plates');

var server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 8000
});

server.views({
  engines: {
    html: {
      module: Plates,
      compileMode: 'sync',
      compile: function(template_html, compile_options) {
        return function(context, options) {
          return Plates.bind(template_html, context);
        }
      }
    }
  },
  path: Path.join(__dirname, 'views')
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply.view('index', {});
  }
});
server.start();
