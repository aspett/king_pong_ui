var moment = require('moment');

var M = function(Module, App, Backbone, Marionette, $, _) {

  var ensureRoomStatus = function() {
    if(Module.roomStatus === undefined) {
      Module.roomStatus = new RoomStatus();
    }
  }
  Module.on('occupied.show', function(options) {
    ensureRoomStatus();
    if(options && options.region) {
      var view = new RoomView({
        model: Module.roomStatus
      });
      options.region.show(view);
    }
  });

  Module.on('occupied.update', function(status) {
    console.log(status);
    if(status.open !== undefined && status.since !== undefined) {
      Module.roomStatus.set({occupied: status.open, since: status.since});
    }
  });
  var RoomView = Backbone.Marionette.ItemView.extend({
    template: '#template-occupied',
    onRender: function() {
      this.$el = this.$el.children();
      this.$el.unwrap();
      this.setElement(this.$el);
    },
    templateHelpers: function() {
      var _this = this;
      return {
        occupied_class: function () { return _this.model.get('occupied') ? 'occupied' : 'free' },
        occupied_text:  function () { return _this.model.get('occupied') ? 'in use' : 'free' },
        occupied_since: function () { return moment(_this.model.get('since')).format("h:mm:ss a") }
      };
    },
    modelEvents: {
      'change': 'render'
    }
  });
  var RoomStatus = Backbone.Model.extend({
    defaults: {
      occupied: true,
      since: moment(moment().format("YYYY-MM-DD"))
    },
  });
}
module.exports = M;
