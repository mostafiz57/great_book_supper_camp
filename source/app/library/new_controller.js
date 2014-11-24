App.module("LibraryApp.New", function(New, App, Backbone, Marionette, $, _){
  New.Controller = {
    newLibrary: function(){

      var fetchingCategory = App.request("library:categories");
      $.when(fetchingCategory).done(function(data){
      var pageval = ((data.models[0]).get('value'));
      var category = new Backbone.Collection;
      var file_upload_status = false;
      
      category.add(pageval.category);
     
      var newLibraryLoyout = new New.Layout();
      var downloadLibrary = new New.downloadLibrary();
      var viewLibrary = new New.viewLibrary({
        collection : category
      });

      viewLibrary.on("category:get-sub-category", function(cat_id) { 
        var sub_cat =[];
         (pageval.subCategory).forEach(function(item){
          if(item.cat_id == cat_id)
          {
            sub_cat.push(item.name)
          }
        });
        viewLibrary.populateSubCategory(sub_cat);

      });

      viewLibrary.on("library:save-data" , function(lib_data){

      var operationStatus = {
          success: function(model, response) {
          },
          error: function(model, response) {
          }
      };

        var saveLib = new App.Entities.SaveLibrary();
        if(!saveLib.save(lib_data,operationStatus)){
           viewLibrary.triggerMethod("form:data:invalid", saveLib.validationError);
        }


      });

      viewLibrary.on("library:upload-file" , function(data){
        var upload = new App.Entities.UploadFile(); 
         var operationStatus = {
          success: function(model, response) {
            file_upload_status = true;
          },
          error: function(model, response) {
             file_upload_status = false;
          }
      };

      if(!upload.save(data,operationStatus)){
        file_upload_status = false;
        viewLibrary.uploadValidation(upload.validationError);
      }

      });


        newLibraryLoyout.on("show", function() {
        newLibraryLoyout.downloadLibraryRegion.show(downloadLibrary) ;
        newLibraryLoyout.viewLibraryRegion.show(viewLibrary) ;
        });

      App.mainRegion.show(newLibraryLoyout);

      })
       
      
    }
  };
});
