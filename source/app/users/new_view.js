App.module("UserApp.New", function(New, App, Backbone, Marionette, $, _){
  New.User = App.UserApp.Common.Views.Form.extend({
    title: "New User",

    onRender: function(){
      this.$(".js-submit").text("Create user");
    }
  });
});
