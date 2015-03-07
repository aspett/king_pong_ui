var $ = require('jquery');
var _  = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');
var io = require('socket.io-client');

var App = new Marionette.Application();

App.addInitializer(function(options) {
  var socket = io('http://localhost:8000');
  socket.on('connect', function() { 
    console.log("Connected to websocket");
    socket.emit('burp', 'lel');
  });
  socket.on('test', function(data) {
    // console.log(data);
  });
  socket.on('heartbeat', function(data) {
    // console.log("Heartbeat received from server: " + data);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  App.start();
});
