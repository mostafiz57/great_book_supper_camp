var App = new Marionette.Application();

App.addRegions({
  headerRegion: "#header-region",
  mainRegion: "#main-region",
  dialogRegion: Marionette.Region.Dialog.extend({
    el: "#dialog-region"
  })
});

App.navigate = function(route,  options){
  options || (options = {});
  Backbone.history.navigate(route, options);
};

App.getCurrentRoute = function(){
  return Backbone.history.fragment
};

App.on("initialize:after", function(){
  if(Backbone.history){
    Backbone.history.start();

    if(this.getCurrentRoute() === ""){
      App.trigger("users:list");
    }
  }
});