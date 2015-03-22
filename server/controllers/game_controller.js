var _ = require('underscore');
var KP = require('../lib/king_pong_api');

var GameController = {
  addPoint: function(data, sockets) {
    var side = data['side'] === "left" ? "left" : "right";
    KP.CurrentGame.addPoint({side: side}, function(err, point) {
      console.log('wat');
      KP.CurrentGame.getScore(function(err, game) {
        console.log(err, game);
        if(!err) {
          console.log('canemit');
          for(let socket of sockets) {
            console.log('emit');
            console.log(game);
            socket.emit('test', 'incoming score');
            socket.emit('game.score', {left: game.left_score, right: game.right_score});
            socket.emit('leftlog.add', "Won a point");
          }
        }
      });
    });
  },
  updateRoomStatus: function(sockets) {
    KP.RoomLog.getStatus(function(status) {
      console.log(status);
      if(status !== "error") {
        for(let socket of sockets) {
          socket.emit('occupied.update', status);
        }
      }
    });
  },
  setRoomStatus: function(status) {
    KP.RoomLog.setStatus(status, function() { });
  }
}

module.exports = GameController;
