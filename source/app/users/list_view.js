App.module("UserApp.List", function(List, App, Backbone, Marionette, $, _) {
    List.Layout = Marionette.Layout.extend({
        template: "#user-list-layout",
        onShow: function() {
            $('body').removeClass('login example2');
            setUpJquery();
        },
        regions: {
            usersRegion: "#users-region",
            newUserPanelRegion: "#new-panel-region",
            editUserPanelRegion: "#edit-panel-region",
            messageUserPanelRegion: "#message-panel-region"
        }
    });


    List.User = Marionette.ItemView.extend({
        tagName: "tr",
        template: "#user-list-item",
        triggers: {
            "click td button.js-edit": "user:edit",
            "ifClicked .select-user": "user:select-user-for-message",
            "click button.js-message": "user:send-message",
            "click div label.js-enable-disable": "user:set-status"
        }
    });

    var NoUsersView = Marionette.ItemView.extend({
        template: "#user-list-none",
        tagName: "tr",
        className: "warning"
    });

    List.Users = Marionette.CompositeView.extend({
        template: "#user-list",
        emptyView: NoUsersView,
        itemView: List.User,
        itemViewContainer: "tbody",
        onShow: function() {
            $('.userEnable').wrap('<label class="js-enable-disable" ><div class="make-switch" data-on="success" data-off="danger" data-on-label="Enable" data-off-label="Disable"></label>').parent().bootstrapSwitch();
            $('.en-dis').removeClass('userEnable');
          
        },
        initialize: function() {
            this.listenTo(this.collection, "reset", function() {
                this.appendHtml = function(collectionView, itemView, index) {
                    collectionView.$el.append(itemView.el);
                }
            });
        },
        onCompositeCollectionRendered: function() {
            this.appendHtml = function(collectionView, itemView, index) {
                collectionView.$("tbody").prepend(itemView.el);
                $('.userEnable').wrap('<label class="js-enable-disable" ><div class="make-switch" data-on="success" data-off="danger" data-on-label="Enable" data-off-label="Disable"></label>').parent().bootstrapSwitch();
                $('.en-dis').removeClass('userEnable');
                Main.init();
              
            }
              this.delegateEvents();
        },
          
    });

    List.NewUserPanel = Marionette.ItemView.extend({
        template: "#new-user-panel",
        events: {
            "click button.js-submit": "submitClicked"
        },

        submitClicked: function(e) {
            e.preventDefault();
            var data = Backbone.Syphon.serialize(this);
            data.studyGroup = $j("#add-study-gruop-box").chosen().val();
            this.trigger("form:save-user", data);
        },

        clearAll: function() {
            $(".form-group").removeClass("has-error");
            $("#study-group-label").removeClass("error-color");
            $("#study-group-panel").removeClass("error-border-color");
            $("#create-new-user")[0].reset();
            $j("#add-study-gruop-box").chosen().val('').trigger('liszt:updated');
            $('html, body').animate({scrollTop: $('#users-region').position().top}, 'slow'); //Set focus on user list
        },

        failOperation: function(cssClass) {
            $('#error-save-label').removeClass('no-display').fadeOut(20000);
        },

        flash: function(cssClass) {
            var $view = this.$el;
            $view.hide().toggleClass(cssClass).fadeIn(2000, function() {
                setTimeout(function() {
                $view.toggleClass(cssClass);
                }, 5000);
            });
        },  

        onFormDataInvalid: function(errors) {
            var $view = this.$el;
            var clearFormErrors = function() {

                var $form = $view.find("form");
                $form.find(".help-inline.error").each(function() {
                    $(this).remove();
                });
                $form.find(".form-group.has-error").each(function() {
                    $(this).removeClass("has-error");
                });

                $view.find("#study-group-label").removeClass("error-color");
                $view.find("#study-group-panel").removeClass("error-border-color");
            }

            var markErrors = function(value, key) {

                var $controlGroup = $view.find("#user-" + key).parent().parent();
                var $controlDiv = $view.find("#user-" + key).parent();
                if (key != "stGroup") {
                     var err = "err_" + key;
                     var $errorEl = $("<span>", {class: "help-block " + err + " ", text: value});
                     $controlDiv.append($errorEl);
                    $controlGroup.addClass("has-error");
                } else {
                    $view.find("#study-group-label").addClass("error-color");
                    $view.find("#study-group-panel").addClass("error-border-color");
                }
            }

            clearFormErrors();
            _.each(errors, markErrors);
        }


    });

    List.EditUserPanel = Marionette.ItemView.extend({
        template: "#edit-user-panel",
        events: {
            "click a.js-edit-submit": "editClicked"
        },
        editClicked: function(e) {
            e.preventDefault();
            var data = Backbone.Syphon.serialize(this);
            data.studyGroup = $j("#study-gruop-box").chosen().val();
            this.trigger("form:edit-user", data);
        },
        initialize: function(evt) {
            var stGroup = '', exRoll = '';
            var userColl = evt.collection;
            var userMod = evt.model;
            var st_group = userMod.get("studyGroup");

            userColl.each(function(m) {
                if (m.get("category") == "URoll") {
                    var s = "";
                    if (userMod.get("extraRoll") == m.get("name"))
                    {
                        s = "selected=selected";
                    }
                    exRoll += '<option ' + s + ' value=' + m.get("name") + '>' + m.get("name") + '</option>';
                }

                if (m.get("category") == "STGroup") {

                    var c = "";
                    if (st_group.indexOf(m.get("name")) > -1)
                    {
                        c = "selected";
                    }
                    stGroup +='<option '+ c + ' value=' +m.get("name")+ ' >'+ m.get("name") + '</option>';
                }

            });

            setTimeout(function() {
                this.$('#edit-user-name').val( userMod.get("name"));
                this.$('#edit-user-phone').val( userMod.get("phone"));
                this.$('#edit-user-email').val( userMod.get("email"));
                this.$('#id').val( userMod.get("id"));
                this.$('#edit-user-extraRoll').append(exRoll);
                this.$('#study-gruop-box').append(stGroup);
                Main.init();
                $j(".chzn-select").chosen(); 
                $j(".chzn-select-deselect").chosen({allow_single_deselect:true});
              
            }, 500);

        },

        flash: function(cssClass) {

        },

        setFocus: function() {
            $('html, body').animate({scrollTop: $('#edit-panel-region').position().top}, 'slow');
        },

        clearAll: function() {
            $("#edit-user-form")[0].reset();
            $j("#study-gruop-box").chosen().val('').trigger('liszt:updated');
            $('html, body').animate({scrollTop: $('#users-region').position().top}, 'slow');
            $('.userEnable').wrap('<label class="js-enable-disable" ><div class="make-switch" data-on="success" data-off="danger" data-on-label="Enable" data-off-label="Disable"></label>').parent().bootstrapSwitch();
            $('.en-dis').removeClass('userEnable');
             Main.init();
             this.undelegateEvents();
        },

        failOperation: function(cssClass) {
             $('#error-edit-label').removeClass('no-display').fadeOut(25000);
        },

        onFormDataInvalid: function(errors) {
            var $view = this.$el;
            var clearFormErrors = function() {

                var $form = $view.find("form");
                $form.find(".help-inline.error").each(function() {
                    $(this).remove();
                });
                $form.find(".form-group.has-error").each(function() {
                    $(this).removeClass("has-error");
                });

                $view.find("#edit-study-group-label").removeClass("error-color");
                $view.find("#edit-study-group-panel").removeClass("error-border-color");
            }

            var markErrors = function(value, key) {
                var $controlGroup = $view.find("#edit-user-" + key).parent().parent();
                if (key != "stGroup") {
                    var $errorEl = $("<label>", {class: "col-sm-2.5 control-label help-inline", text: value});
                    $controlGroup.addClass("has-error");
                } else {
                    $view.find("#edit-study-group-label").addClass("error-color");
                    $view.find("#edit-study-group-panel").addClass("error-border-color");
                }
            }
            clearFormErrors();
            _.each(errors, markErrors);
        }
    });

    List.UserMessagePanel = Marionette.ItemView.extend({
        template: "#user-message-form",
        events: {
            "click a.js-message-submit": "sendMessage"
        },
        setFocus: function() {
            $('html, body').animate({scrollTop: $('#message-panel-region').position().top}, 'slow');
        },
        clearAll: function() {
            $("#user-messaging")[0].reset();
            CKEDITOR.instances.textMessage.setData('');
            $('html, body').animate({scrollTop: $('#users-region').position().top}, 'slow'); //Set focus on user list
        },
        failOperation: function(cssClass) {
            $('#error-email-label').removeClass('no-display').fadeOut(25000);
        },
        sendMessage: function(e) {
            e.preventDefault();
            var data = Backbone.Syphon.serialize(this);
            data.textMessage = CKEDITOR.instances.textMessage.getData();
            this.trigger("form:submit", data);
        },
        onFormDataInvalid: function(errors) {
            var $view = this.$el;
            var clearFormErrors = function() {


            }

            var markErrors = function(value, key) {

            }
            clearFormErrors();
            _.each(errors, markErrors);
        }

    });


});


function setUpJquery() {
    Main.init();
    Login.init();
    if (hasData) {
        TableData.init();
    }
    CKEDITOR.replace("textMessage");
    setTimeout(function() {
        $j(".chzn-select").chosen(); 
        $j(".chzn-select-deselect").chosen({allow_single_deselect:true});
    },400);
}
