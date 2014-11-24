App.module("BookApp.Show", function(Show, App, Backbone, Marionette, $, _){
  Show.Controller = {
    showBook: function(){
      var view = new Show.Message();
      App.mainRegion.show(view);
    }
  };
});
