App.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    Entities.User = Backbone.Model.extend({
        urlRoot: "/api/users",
        defaults: {
            id: "",
            name: "",
            phone: "",
            email: "",
            userRoll: "",
            studyGroup: " ",
            activeStatus :true,
            type : 1
        },
        validate: function(attrs, options) {
            var study_group_status = false;
            var email_status = validateEmail(attrs.email);
            $.each(attrs.studyGroup, function(i, val) {
                if (val) {
                    study_group_status = true;
                }
            });

            var errors = {}
            if (!attrs.name) {
                errors.name = "This field is required.";
            }
            if (!attrs.email || !email_status) {
                errors.email = "This field is required.";
            }
            if (!attrs.extraRoll) {
                errors.extraRoll = "This field is required.";
            }
            if (!study_group_status) {
                errors.stGroup = "This field is required.";
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
    /email validation/
    function validateEmail(sEmail) {
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (filter.test(sEmail)) {
            return true;
        }
        else {
            return false;
        }
    }
    //  Entities.configureStorage(Entities.User);

    Entities.UserCollection = Backbone.Collection.extend({
        url: "/api/users",
        /*parse: function(response) {
         u = response.userList;
         return response.userList;
         }, */
        model: Entities.User,
        comparator: "name"
    });

    var initializeUsers = function() {
        users = new Entities.UserCollection();
        users.forEach(function(user) {
            user.save();
        });
        return users.models;
    };

    var API = {
        getUserEntities: function() {
            var users = new Entities.UserCollection();
            var defer = $.Deferred();
            users.fetch({
                success: function(data) {
                    defer.resolve(data);
                }
            });
            var promise = defer.promise();
            $.when(promise).done(function(users) {
                if (users.length === 0) {
                    var models = initializeUsers();
                    users.reset(models);
                }
            });
            return promise;
        },
        getUserEntity: function(userId) {
            var user = new Entities.User({id: userId});
            var defer = $.Deferred();
            setTimeout(function() {
                user.fetch({
                    success: function(data) {
                        defer.resolve(data);
                    },
                    error: function(data) {
                        defer.resolve(undefined);
                    }
                });
            }, 2000);
            return defer.promise();
        },
    };

    App.reqres.setHandler("user:entities", function() {
        return API.getUserEntities();
    });

    App.reqres.setHandler("user:entity", function(id) {
        return API.getUserEntity(id);
    });


});
