App.module("LoginApp.Login", function(Login, App, Backbone, Marionette, $, _) {
    Login.Controller = {
        showLogin: function() {
            var view = new Login.Message();
            view.on("form:submit", function(data) {
                var loginUser = new App.Entities.Login();

                var operationStatus = 
                {
                    success: function(model, response) {
                        if(response){
                            App.navigate('users',true);
                        }else{
                            view.loginFail();
                        }
                        
                    },
                    error: function(model, response) {
                       view.loginError();
                    }
                };

                if (loginUser.save(data,operationStatus)) {

                }
                else {
                    view.triggerMethod("form:data:invalid", loginUser.validationError);
                }
            });

            view.on("form:getPassword" , function(data){
                 var operationStatus = 
                {
                    success: function(model, response) {
                        if(response){
                           view.passwordSend();
                        }else{
                            view.loginFail();
                        }
                        
                    },
                    error: function(model, response) {
                       view.loginError();
                    }
                };

                var pwd = new App.Entities.pwd();
                pwd.save(data,operationStatus);

            });

            App.mainRegion.show(view);
        }

    };
});
