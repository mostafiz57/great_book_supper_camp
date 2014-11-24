App.module("BookApp.Show", function(Show, App, Backbone, Marionette, $, _){
  Show.Message = Marionette.ItemView.extend({
    template: "#book-message"
  });
});
