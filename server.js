var Hapi = require('hapi');
var Boom = require('boom');

var Path = require('path');
var Plates = require('plates');

var server = new Hapi.Server();

server.connection({
  // host: 'localhost',
  port: 8000
});

var listener = server.listener;

var io = require('socket.io')(server.listener);
io.on('connection', function(socket) {
  socket.emit('test', 'data');

  socket.on('burp', function() {
    socket.emit('test', 'received');
  });

  var heartbeat = function() {
    socket.emit('heartbeat', (new Date).getTime());
    setTimeout(heartbeat, 10000);
  }

  heartbeat();
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

server.route({
    path: "/javascript/client.js",
    method: "GET",
    handler: {
      file: "./client/built/javascript/client.js"
    }
});

server.route({
    path: "/javascript/client.js.map",
    method: "GET",
    handler: {
      file: "./client/built/javascript/client.js.map"
    }
});

server.route({
    path: "/stylesheets/client.css",
    method: "GET",
    handler: {
      file: "./client/built/stylesheets/client.css"
    }
});
server.start();
