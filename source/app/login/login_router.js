App.module("LoginApp", function(LoginApp, App, Backbone, Marionette, $, _) {
    LoginApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "login": "showLogin"
        }
    });

    var API = {
        showLogin: function() {
            LoginApp.Login.Controller.showLogin();
            App.execute("set:active:header", "login");
        }
    };

    App.on("login:show", function() {
        App.navigate("login");
        API.showLogin();
    });

  App.addInitializer(function(){
        new LoginApp.Router({
            controller: API
        });
    });
});


