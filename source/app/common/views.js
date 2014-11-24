App.module("Common.Views", function(Views, App, Backbone, Marionette, $, _){
  Views.Loading = Marionette.ItemView.extend({
    template: "#loading-view",

    initialize: function(options){
      var options = options || {};
      this.title = options.title || "Loading Data";
      this.message = options.message || "Please wait, data is loading.";
    },

    serializeData: function(){
      return {
        title: this.title,
        message: this.message
      };
    },

    onShow: function(){
      var opts = {
        lines: 20, 
        length: 10, 
        width: 5, 
        radius: 15,
        corners: 1, 
        rotate: 0,
        direction: 1,
        color: "#006dcc", 
        speed: 1, 
        trail: 60, 
        shadow: false, 
        hwaccel: false, 
        className: "spinner",
        zIndex: 2e9,
        top: "30px", 
        left: "auto" 
      };
      $("#spinner").spin(opts);
    }
  });
});
