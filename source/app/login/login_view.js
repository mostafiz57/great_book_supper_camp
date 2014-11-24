App.module("LoginApp.Login", function(Login, App, Backbone, Marionette, $, _) {
    Login.Message = Marionette.ItemView.extend({
        template: "#login-form",
        onShow: function() {
            $('body').addClass('login example2');
            setLoginJquery();
        },
        events: {
            "click button.js-sign-in": "submitClicked",
            "click button.js-get-password" : "submitForPassword"
        },
        submitClicked: function(e) {
            e.preventDefault();
            var data = Backbone.Syphon.serialize(this);
            this.trigger("form:submit", data);
        },
        submitForPassword: function(e) {
            e.preventDefault();
            var data = Backbone.Syphon.serialize(this);
            this.trigger("form:getPassword", data);
        },
        loginFail : function(){
            var $view = this.$el;
            $view.find('#login-combination-error').removeClass('no-display');
            $view.find('#login-server-error').addClass('no-display');
        },
        loginError : function(){
            var $view = this.$el;
             $view.find('#login-combination-error').addClass('no-display');
             $view.find('#login-server-error').removeClass('no-display');
          
        },
        passwordSend :function(){
          var $view = this.$el;
           $view.find('.box-login').show();
           $view.find('.box-forgot').hide();
           $view.find('.errorHandler').addClass('no-display');
           $view.find('#password-send').removeClass('no-display').fadeOut(20000);
           
        },
        onFormDataInvalid: function(errors) {
            var $view = this.$el;
            var clearFormErrors = function() {

                var $form = $view.find("form");
                $form.find(".help-block").each(function() {
                    $(this).remove();
                });
                $form.find(".form-group.has-error").each(function() {
                    $(this).removeClass("has-error");
                });
            }

            var markErrors = function(value, key) {
                var err = "err_" + key;
                var $controlGroup = $view.find("#login-" + key).parent().parent();
                var $errorEl = $("<span>", {class: "help-block " + err + " ", text: value});
                $controlGroup.append($errorEl).addClass("has-error");

            }
            clearFormErrors();
            _.each(errors, markErrors);
        }



    });
});

function setLoginJquery() {
    Main.init();
    Login.init();
}

function clearErrors(key) {
     var err = ".err_" + key;
    $(err).each(function() {
        $(this).remove();
    });
}