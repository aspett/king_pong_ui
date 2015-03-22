// var request = require('request-promise');
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
mongoose.connect('mongodb://localhost/king_pong');

var GameSchema = new Schema({
  kind: String,
  id: String,
  created_at: Date,
  match_id: Number,
  left_score: Number,
  right_score: Number,
  completed_at: Date
});

var GameModel = mongoose.model('Game', GameSchema);

var RoomSchema = new Schema({
  id: Number,
  open: Boolean,
  since: Date
});

var RoomModel = mongoose.model('Room', RoomSchema);


class Game {
  constructor(id) {
    if(id === undefined) {
      this.game = new GameModel({
        left_score: 0,
        right_score: 0
      });
    }
    else {
      var _this = this;
      GameModel.find({ uuid: id}, function(err, game) {
        if(err) throw "Game not found";
        _this.game = game[0];
      });
    }
  }

  addPoint(data, callback) {
    if(data.side == 'left')
      this.game.left_score += 1;
    else
      this.game.right_score += 1;
    callback(null, null);
  }

  getScore(callback) {
    callback(false, {left_score: this.game.left_score, right_score: this.game.right_score});
  }
}

var CurrentGame = new Game();

class Match {

}

class Player {

}

class Point {

}

class RoomLog {
  static setStatus(status, callback) {
    RoomModel.find({id: 1}, function(err, room) {
      if(err) callback("error");
      else {
        if(room[0] === undefined) {
          var m = new RoomModel({
            id: 1,
            open: status == "open" ? true : false,
            since: new Date()
          });
          m.save();
          callback(m);
        }
        else {
          room[0].update({open: status == "open" ? true : false, since: new Date()}, function(err, num, raw) {

          });
        }
      }
    });
  }
  static getStatus(callback) {
    RoomModel.find({id: 1}, function(err, room) {
      if(err) callback("error");
      else {
        if(room[0] !== undefined)
          callback(room[0]);
        else
          callback("error");
      }
    });

  }
}

module.exports = {
  CurrentGame: CurrentGame,
  Game: Game,
  Match: Match,
  Player: Player,
  Point: Point,
  RoomLog: RoomLog
}
