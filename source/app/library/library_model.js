App.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    Entities.Library = Backbone.Model.extend({
        urlRoot: "/api/library",
        validate: function(attrs, options) {
           
        }
    });

   Entities.CategoryCollection = Backbone.Collection.extend({
     url: "/api/category",
     Model : Entities.Library,
     comparator: "name"
   });

   Entities.UploadFile = Backbone.Model.extend({
     url : "/api/uploadFile",
      validate: function(attrs, options) {
        var errors = {}

        if(!attrs.title){
          errors.title = "This field is required.";
          errors.titleStatus = true;
        }

        if(!attrs.uploadFile){
            errors.uploadFile =true;
        }

        if (!_.isEmpty(errors)) {
            return errors;
        }
           
        }
   });

   Entities.SaveLibrary = Backbone.Model.extend({
    url : "/api/saveLibrary",
     validate: function(attrs, options) {
      var imgByteAmount = unescape(encodeURIComponent(attrs.coverImg)).length
          var errors = {}
            if (!attrs.title) {
                errors.title = "This field is required.";
            }
            if (!attrs.author) {
                errors.author = "This field is required.";
            }
            if (!attrs.tags) {
                errors.tags = "This field is required.";
            }
            
            if (!attrs.coverImg) {
                errors.coverImg = "This field is required.";
            }else{
              if(imgByteAmount > 52000000){
                 errors.coverImg = "Image Size is big.Please try again!";
              }

            }
           
            if (!_.isEmpty(errors)) {
                return errors;
            }
           
        }
   });

 

var API = {
    getCategories : function(){
          var category = new Entities.CategoryCollection();
            var defer = $.Deferred();
             category.fetch({
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
    }
}
 
  App.reqres.setHandler("library:categories", function() {
        return API.getCategories();
    });
});