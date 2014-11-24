App.module("BookApp", function(BookApp, App, Backbone, Marionette, $, _){
  BookApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "book" : "showBook"
    }
  });

  var API = {
    showBook: function(){
      BookApp.Show.Controller.showBook();
      App.execute("set:active:header", "book");
    }
  };

  App.on("book:show", function(){
    App.navigate("book");
    API.showBook();
  });

  App.addInitializer(function(){
    new BookApp.Router({
      controller: API
    });
  });
});
