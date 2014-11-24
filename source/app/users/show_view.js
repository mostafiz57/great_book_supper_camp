App.module("UserApp.Show", function(Show, App, Backbone, Marionette, $, _){
  Show.MissingUser = Marionette.ItemView.extend({
    template: "#missing-user-view"
  });
 
  Show.User = Marionette.ItemView.extend({
    template: "#user-view",

    events: {
      "click a.js-edit": "editClicked"
    },

    editClicked: function(e){
      e.preventDefault();
      this.trigger("user:edit", this.model);
    }
  });
});
