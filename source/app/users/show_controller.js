App.module("UserApp.Show", function(Show, App, Backbone, Marionette, $, _){
  Show.Controller = {
    showUser: function(id){
      var loadingView = new App.Common.Views.Loading({
        title: "Artificial Loading Delay",
        message: "Data loading is delayed to demonstrate using a loading view."
      });
      App.mainRegion.show(loadingView);

      var fetchingUser = App.request("user:entity", id);
      $.when(fetchingUser).done(function(user){
        var userView;
        if(user !== undefined){
          userView = new Show.User({
            model: user
          });

          userView.on("user:edit", function(user){
            App.trigger("user:edit", user.get("id"));
          });
        }
        else{
          userView = new Show.MissingUser();
        }

        App.mainRegion.show(userView);
      });
    }
  }
});
