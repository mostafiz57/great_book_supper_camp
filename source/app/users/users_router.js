App.module("UserApp", function(UserApp, App, Backbone, Marionette, $, _){
  UserApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "users(/filter/criterion::criterion)": "listUsers",
      "users/:id": "showUsers",
      "users/:id/edit": "editUsers"
    }
  });

  var API = {
    listUsers: function(criterion){
      UserApp.List.Controller.listUsers(criterion);
      App.execute("set:active:header", "users");
    },

    showUsers: function(id){
      UserApp.Show.Controller.showUser(id);
      App.execute("set:active:header", "users");
    },

    editUsers: function(id){
      UserApp.Edit.Controller.editUser(id);
      App.execute("set:active:header", "users");
    }
  };

  App.on("users:list", function(){
    App.navigate("users");
    API.listUsers();
  });

  App.on("users:filter", function(criterion){
    if(criterion){
      App.navigate("users/filter/criterion:" + criterion);
    }
    else{
      App.navigate("users");
    }
  });

  App.on("user:show", function(id){
    App.navigate("users/" + id);
    API.showUsers(id);
  });

  App.on("user:edit", function(id){
    App.navigate("users/" + id + "/edit");
    API.editUsers(id);
  });

  App.addInitializer(function(){
    new UserApp.Router({
      controller: API
    });
  });
});
