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
