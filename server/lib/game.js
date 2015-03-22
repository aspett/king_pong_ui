class Game {
  constructor(id) {
    var _this = this;
    GameModel.find({ uuid: id}, function(err, game) {
      if(err) throw "Game not found";
      _this.game = game;
    });
  }

  addPoint(data, callback) {

  }

  getScore(callback) {

  }
}
