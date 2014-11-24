App.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    Entities.Login = Backbone.Model.extend({
        urlRoot: "/api/login",
        validate: function(attrs, options) {
            var errors = {}
            if (!attrs.username) {
                errors.username = "This field is required.";
            }

            if (!attrs.password) {
                errors.password = "This field is required.";
            } 
            else {
                if (attrs.password.length <6) {
                    errors.password = "Please enter at least 6 characters";
                }
            }

            if (!_.isEmpty(errors)) {
                return errors;
            }
        }
    });

   Entities.pwd = Backbone.Model.extend({
        urlRoot: "/api/getPassword",

       validate: function(attrs, options) {
            var errors = {}
            console.log(attrs)
            if (!attrs.email) {
                errors.email = "This field is required.";
            }
            if (!_.isEmpty(errors)) {
                return errors;
            }
        }
    });

 
    App.on("login:user", function(data) {
        App.trigger("login:status", data);
    });

    App.reqres.setHandler("login:user", function(id) {
        return id;
    });

});