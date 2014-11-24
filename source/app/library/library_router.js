App.module("LibraryApp", function(LibraryApp, App, Backbone, Marionette, $, _){
  LibraryApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "newLibrary" : "newLibrary"
    }
  });

  var API = {
      newLibrary: function(){
      LibraryApp.New.Controller.newLibrary();
      App.execute("set:active:header", "newLibrary");
    },
    showLibrary : function (){
     
      LibraryApp.Show.Controller.showLibrary();
      App.execute("set:active:header","showLibrary");
    }
  };

  App.on("library:new", function(){
    App.navigate("newLibrary");
    API.newLibrary();
  });

  App.on("library:show",function(){
    App.navigate("showLibrary");
    API.showLibrary();
  });
  
  App.addInitializer(function(){
    new LibraryApp.Router({
      controller: API
    });
  });
});
