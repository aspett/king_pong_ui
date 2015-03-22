var M = function(Module, App, Backbone, Marionette, $, _) {

  Module.on('start', function() {
    Module.ScoreView = ScoreView;
  });

  var ensureGame = function() {
    if(Module.game === undefined) {
      Module.game = new Game();
    }
  };

  Module.on('score.show', function(options) {
    ensureGame();
    if(options && options.region) {
      var view = new ScoreView({
        model: Module.game
      });
      options.region.show(view);
    }
  });

  Module.on('leftplayerinfo.show', function(options) {
    ensureGame();
    if(options && options.region) {
      var view = new InfoView({
        template: '#template-left-info',
        model: Module.game.get('left_player')
      });
      options.region.show(view);
    }
  });

  Module.on('rightplayerinfo.show', function(options) {
    ensureGame();
    if(options && options.region) {
      var view = new InfoView({
        template: '#template-right-info',
        model: Module.game.get('right_player')
      });
      options.region.show(view);
    }
  });

  Module.on('serving.show', function(options) {
    ensureGame();
    if(options && options.region) {
      var view = new ServeView({
        model: Module.game
      });
      options.region.show(view);
    }
  });

  Module.on('score.update', function(data) {
    if(data && data.left !== undefined && data.right !== undefined) {
      Module.game.set({left_score: data.left, right_score: data.right});
    }
  });

  var addLog = function(side, data) {
    var side_player = side === "left" ? "left_player" : "right_player";
    var player = Module.game.get(side_player);
    var logs = player.get('_logs');
    logs.unshift(data);
    player.setLogs(logs);
  }
  Module.on('leftlog.add', function(data) {
    if(data) {
      addLog('left', data);
    }
  });

  Module.on('rightlog.add', function(data) {
    if(data) {
      addLog('right', data);
    }
  });

  var ScoreView = Backbone.Marionette.ItemView.extend({
    template: '#template-score',
    onRender: function() {
      this.$el = this.$el.children();
      this.$el.unwrap();
      this.setElement(this.$el);
    },
    modelEvents: {
      'change': 'render'
    }
  });

  var InfoView = Backbone.Marionette.ItemView.extend({
    //Pass in template
    templateHelpers: function() {
      var _this = this;
      return {
        logs: function() { return _this.model.get('_logs').join("\n"); }
      };
    },
    modelEvents: {
      'change': 'render'
    },
  });

  var ServeView = Backbone.Marionette.ItemView.extend({
    template: '#template-serve',
    templateHelpers: function() {
      var _this = this;
      return {
        serving: function() {
          return _this.model.get('left_serve') ?
            _this.model.get('left_player').get('name') :
            _this.model.get('right_player').get('name');
        }
      };
    },
    modelEvents: {
      'change': 'render'
    }
  });

  var Game = Backbone.Model.extend({
    initialize: function() {
      var _this = this;
      console.log('init');

      this.bindLeftPlayer();
      this.bindRightPlayer();

      this.on('change:left_player', function() {
        this.bindLeftPlayer();
      });

      this.on('change:right_player', function() {
        this.bindRightPlayer();
      });
    },
    defaults: function () {
      return {
        left_score: 0,
        right_score: 0,
        left_player: new Player(),
        right_player: new Player(),
        left_serve: true
      };
    },
    bindLeftPlayer: function() {
      var _this = this;
      this.get('left_player').on('change', function() { _this.trigger('change'); });
    },
    bindRightPlayer: function() {
      var _this = this;
      this.get('right_player').on('change', function() { _this.trigger('change'); });
    }
  });

  var Player = Backbone.Model.extend({
    defaults: {
      name: 'Player Name',
      img_src: 'http://www.edrants.com/wp-content/uploads/2009/09/placeholder.jpg',
      _logs: ["test", "test"]
    },
    setLogs: function(logs) {
      this._logs = logs;
      this.trigger('change');
      this.trigger('change:_logs');
    }
  })

  var Players = Backbone.Collection.extend({
    model: Player
  });

}
module.exports = M;
