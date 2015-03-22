var Hapi   = require('hapi');
var Boom   = require('boom');
var Path   = require('path');
var Plates = require('plates');
             require('babel/register');

var server = new Hapi.Server();

server.connection({
  port: 8000
});

var Controllers = {
  GameController: require('./server/controllers/game_controller.js')
}

var listener = server.listener;

var sockets = new Set();
var io = require('socket.io')(server.listener);
io.on('connection', function(socket) {
  sockets.add(socket);

  // socket.emit('test', 'data');

  socket.on('burp', function() {
    socket.emit('test', 'received');
  });

  socket.on('addpoint', function(data) {
    Controllers.GameController.addPoint(data, sockets);
    socket.emit('test', 'received');
  });

  socket.on('disconnect', function() {
    sockets.delete(socket);
  });

  var heartbeat = function() {
    socket.emit('heartbeat', (new Date).getTime());
    socket.emit('count', sockets.size);
    setTimeout(heartbeat, 10000);
  }

  heartbeat();
});

var current = "open";
var roomUpdater = function() {
  console.log('update room' + current);
  Controllers.GameController.setRoomStatus(current, sockets);
  current = current == "open" ? "closed" : "open";
  Controllers.GameController.updateRoomStatus(sockets);
  setTimeout(roomUpdater, 5000);
}

roomUpdater();


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
  path: Path.join(__dirname, 'server/views')
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
