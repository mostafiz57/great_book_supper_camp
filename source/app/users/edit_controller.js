App.module("UserApp.Edit", function(Edit, App, Backbone, Marionette, $, _) {
    Edit.Controller = {
        editUser: function(id) {
            var loadingView = new App.Common.Views.Loading({
                title: "Artificial Loading Delay",
                message: "Data loading is delayed to demonstrate using a loading view."
            });

            App.mainRegion.show(loadingView);
            var usersListLayout = new App.UserApp.List.Layout();
            var store = localStorage.getItem("userData");
            var filteredUsers = new Backbone.Collection(JSON.parse(store));
            var userCollection = new Backbone.Collection;
            var roll_st = new Backbone.Collection;
            var dm = new Backbone.Model;

            filteredUsers.forEach(function(userInfo) {

                if (userInfo.get("type") == 1) {
                    userCollection.add(userInfo);
                }
                else if (userInfo.get("type") == 2)
                {
                    roll_st.add(userInfo);
                }

            });


            var fetchingUser = App.request("user:entity", id);
            $.when(fetchingUser).done(function(user) {
                var view;
                if (user !== undefined) {
                    view = new App.UserApp.List.EditUserPanel({
                        model: user,
                        collection: roll_st
                    });

                    view.on("form:submit", function(data) {
                        if (user.save(data)) {
                            App.trigger("user:show", user.get("id"));
                        }
                        else {
                            view.triggerMethod("form:data:invalid", user.validationError);
                        }
                    });
                }
                else {
                    view = new App.UserApp.Show.MissingUser();
                }

                var usersListView = new App.UserApp.List.Users({
                    collection: userCollection
                });

                var newUserPanel = new App.UserApp.List.NewUserPanel({
                    collection: roll_st
                });

                var userMessagePanel = new App.UserApp.List.UserMessagePanel({
                });

                usersListLayout.on("show", function() {
                    usersListLayout.usersRegion.show(usersListView);
                    usersListLayout.editUserPanelRegion.show(view);
                    usersListLayout.newUserPanelRegion.show(newUserPanel);
                    usersListLayout.messageUserPanelRegion.show(userMessagePanel);
                });

                App.mainRegion.show(usersListLayout);
            });
        }
    };
});
