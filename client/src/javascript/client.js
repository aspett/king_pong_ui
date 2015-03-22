var $ = require('jquery');
var _  = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');
var io = require('socket.io-client');

if (window.__agent) {
  window.__agent.start(Backbone, Marionette);
}

var App = new Marionette.Application();
var socket = io('http://localhost:8000');
window.socket = socket;

App.addInitializer(function(options) {
  socket.on('connect', function() { 
    console.log("Connected to websocket");
    socket.emit('burp', 'lel');
  });
  socket.on('test', function(data) {
    console.log(data);
  });
  socket.on('heartbeat', function(data) {
    console.log("Heartbeat received from server: " + data);
  });
  socket.on('count', function(data) {
    console.log("Heartbeat received from server: " + data);
  });
  socket.on('game.score', function(data) {
    console.log(data);
    GameModule.trigger('score.update', data);
  });
  socket.on('leftlog.add', function(data) {
    console.log(data);
    GameModule.trigger('leftlog.add', data);
  });
  socket.on('occupied.update', function(status) {
    console.log('occupied update');
    console.log(status);
    RoomModule.trigger('occupied.update', status);
  });

  var GameModule = App.module('Game', require('./modules/game'));
  var RoomModule = App.module('Room', require('./modules/room'));

  GameModule.trigger('start');
  var BodyView = Backbone.Marionette.LayoutView.extend({
    template: '#template-game',
    regions: {
      ScoreRegion: '#scoreRegion',
      OccupiedRegion: '#occupiedRegion',
      LeftInfoRegion: '#leftInfoRegion',
      RightInfoRegion: '#rightInfoRegion',
      ServeRegion: '#serveRegion'
    },
    onShow: function() {
      GameModule.trigger('score.show', { region: this.ScoreRegion });
      GameModule.trigger('leftplayerinfo.show', { region: this.LeftInfoRegion });
      GameModule.trigger('rightplayerinfo.show', { region: this.RightInfoRegion });
      GameModule.trigger('serving.show', { region: this.ServeRegion });
      RoomModule.trigger('occupied.show', { region: this.OccupiedRegion });

    },
    events: {
      'click .ttable': 'sockettest'
    },
    sockettest: function(event) {
      var side = '';
      if($(event.target).hasClass('ttable-left')) { side = 'left'; }
      else { side = 'right'; }
      socket.emit('addpoint', {side: side});
    }
  });

  App.BodyRegion.show(new BodyView());
});

document.addEventListener('DOMContentLoaded', function () {
  App.addRegions({
    BodyRegion: '#bodyRegion'
  });
  window.app = App;
  App.start();

});
