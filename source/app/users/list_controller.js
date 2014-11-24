App.module("UserApp.List", function(List, App, Backbone, Marionette, $, _) {
    List.Controller = {
        listUsers: function(criterion) {
            var loadingView = new App.Common.Views.Loading();
            var email = [];
            App.mainRegion.show(loadingView);

            var fetchingUsers = App.request("user:entities");

            var usersListLayout = new List.Layout();
            var highestId = 0, assigendEvent = true;
            hasData = false;

            $.when(fetchingUsers).done(function(users) {
                var filteredUsers = users;
                var userCollection = new Backbone.Collection;
                var roll_st = new Backbone.Collection;
                var dm = new Backbone.Model;
                var setModelStatus = false;
                filteredUsers.forEach(function(userInfo) {
                    if (userInfo.get("type") == 1) {
                        userCollection.add(userInfo);
                        hasData = true;
                    }
                    else if (userInfo.get("type") == 2)
                    {
                        roll_st.add(userInfo);
                    }
                    if (!setModelStatus) {
                        dm.set(userInfo.defaults);
                        setModelStatus = true;
                    }
                });

                var newUserPanel = new List.NewUserPanel({
                    collection: roll_st
                });

                var usersListView = new List.Users({
                    collection: userCollection
                });

                var editUserPanel = new List.EditUserPanel({
                    collection: roll_st,
                    model: dm
                });

                var userMessagePanel = new List.UserMessagePanel({
                });

                usersListLayout.on("show", function() {
                    usersListLayout.usersRegion.show(usersListView);
                    usersListLayout.newUserPanelRegion.show(newUserPanel);
                    usersListLayout.editUserPanelRegion.show(editUserPanel);
                    usersListLayout.messageUserPanelRegion.show(userMessagePanel);
                });

                if (users.length > 0 && hasData) {
                    highestId = users.max(function(c) {
                        return c.id;
                    }).get("id");
                }

                newUserPanel.on("form:save-user", function(data) {
                    var newUser = new App.Entities.User();
                    var viewNewUser = new App.UserApp.List.NewUserPanel();
                    highestId = highestId + 1;
                    data.id = highestId;
                    data.location = "Geolocation";
                    data.type = 1;
                    data.opType = "save";

                    var operationStatus = {
                        success: function(model, response) {
                              userCollection.add(newUser);
                        var newUserView = usersListView.children.findByModel(newUser);
                            viewNewUser.clearAll();
                            viewNewUser.flash("success");
                        },
                        error: function(model, response) {
                            viewNewUser.failOperation('text-danger');
                            highestId = highestId - 1;
                        newUserPanel.triggerMethod("form:data:invalid", newUser.validationError);

                        }
                    };

                  newUser.save(data, operationStatus);
                });

                usersListView.on("itemview:user:set-status", function(childView, args) {
                    var newUser = new App.Entities.User();

                    var data = (args.model).toJSON();
                    data.opType = "edit";
                    if (data.activeStatus) {
                        data.activeStatus = false;
                    } else {
                        data.activeStatus = true;
                    }

                    if (newUser.save(data)) {

                    }
                });

                usersListView.on("itemview:user:edit", function(childView, args) {

                    editModel = args.model;
                    var newEeditUserPanel = new List.EditUserPanel({model: editModel, collection: roll_st});
                    if (assigendEvent) {
                        newEeditUserPanel._events = editUserPanel._events;
                        assigendEvent = false;
                    }
                    editUserPanel.render();
                    editUserPanel.setFocus();
                    
                   cldView=childView;
                  
                    newEeditUserPanel.on("form:edit-user", function(data) {
                        data.opType = "edit";
                        data._id='user_'+data.id;
                      
                        var operationStatus = {
                            success: function(model, response) {
                              
                                newEeditUserPanel.clearAll();
                            },
                            error: function(model, response) {
                                editUserPanel.failOperation('text-danger');

                            }
                        };

                        if (editModel.save(data, operationStatus)) {
                            cldView.render();
                            editUserPanel.flash("success");
                            cldView="";
                           }
                        else {
                            editUserPanel.triggerMethod("form:data:invalid", model.validationError);
                        }
                    });

                });

                usersListView.on("itemview:user:select-user-for-message", function(childView, args) {
                    var model = args.model,
                            messageData = {};
                    if (email.indexOf(model.get('email')) == -1) {
                        email.push(model.get('email'));
                    } else {
                        API.removeElement(email, model.get('email'));
                    }

                    userMessagePanel.on("form:submit", function(data) {
                        var userMessage = new List.UserMessagePanel();
                        messageData.opType = "sendEmail";
                        messageData.receiver = model.get('name');
                        messageData.email = model.get('email');
                        messageData.textMessage = data.textMessage;

                        var operationStatus = {
                            success: function(model, response) {
                                userMessage.clearAll();
                            },
                            error: function(model, response) {
                                userMessage.failOperation('text-danger');
                            }
                        };
                        model.save(messageData, operationStatus);

                    });

                });

                usersListView.on("itemview:user:send-message", function(childView, args) {
                    var model = args.model,
                            messageData = {};
                            console.log(model);
                    var userMessage = new List.UserMessagePanel();
                    userMessage.setFocus();

                    userMessagePanel.on("form:submit", function(data) {
                        messageData.opType = "sendEmail";
                        messageData.receiver = model.get('name');
                        messageData.email = model.get('email');
                        messageData.textMessage = data.textMessage;

                        var successStatus = {
                            success: function(model, response) {
                                userMessage.clearAll();
                            },
                            error: function(model, response) {
                                userMessage.failOperation('text-danger');
                            }
                        };
                        model.save(messageData, successStatus);

                    });

                });

                App.mainRegion.show(usersListLayout);
            });

            var API = {
                renderView: function(editUserPanel, newUserPanel) {
                    usersListLayout.on("show", function() {
                        newUserPanel.delegateEvents();
                        editUserPanel.delegateEvents();
                        usersListLayout.editUserPanelRegion.show(editUserPanel);
                    });

                    //  App.mainRegion.show(usersListLayout);
                },
                removeElement: function(arr) {
                    var what, a = arguments, L = a.length, ax;
                    while (L > 1 && arr.length) {
                        what = a[--L];
                        while ((ax = arr.indexOf(what)) !== -1) {
                            arr.splice(ax, 1);
                        }
                    }
                    return arr;
                }
            };
        }
    }



});
