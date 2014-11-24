App.module("LibraryApp.New", function(New, App, Backbone, Marionette, $, _){
  New.Layout = Marionette.Layout.extend({
    template: "#library-new-layout",
		onShow : function(){
			 $('body').removeClass('login example2');
			 setupLibrary();
		},
    regions: {
        downloadLibraryRegion: "#library-download-region",
        viewLibraryRegion: "#library-view-region"

    }
  });

New.downloadLibrary = Marionette.ItemView.extend({
	template: "#library-download-panel"

});


New.viewLibrary = Marionette.ItemView.extend({
	template: "#library-view-panel",
   events: {
        "click a.js-add-book": "submitClicked",
        "change #category-selector": "categorySelected",
        "click a.js-upload" : "fileUpload"
    },
    
    submitClicked: function(e) {
        e.preventDefault();
        var data = Backbone.Syphon.serialize(this);
        var $view = $('.fileupload-preview');
        data.category = $('#category-selector').val();
        data.subCategory =  $('#sub-category').val();
        data.coverImg = $view.find('img:first').attr('src');

        var table = $("#metaTable tbody");
        var meta =[];



        table.find('tr').each(function(key,val){
          var metaVal = [];
          var $tds = $(this).find('td');
          metaVal.push($tds.eq(0).text());
          metaVal.push($tds.eq(1).text());
          meta.push(metaVal);
        })
        data.metaData = meta;
        this.trigger('library:save-data',data);

    },      

    categorySelected : function(e){
      var field = $(e.currentTarget);
      var category_val = $("option:selected", field).attr('id');
         this.trigger("category:get-sub-category", category_val);
    },

    populateSubCategory : function(data){
     var subCategory = '<option value="">Select   Sub-Category</option>';
     data.forEach(function(val){
     subCategory += '<option  value=' + val + '>' + val + '</option>';
     });
     $("#sub-category").html(subCategory);
     
    },

  fileUpload : function (e){
     var data = Backbone.Syphon.serialize(this);
     this.trigger("library:upload-file" , data);


  },

  uploadValidation : function(err){
    var $view = this.$el;
    if(err.uploadFile){
      $view.find('#error-upload-title-label').addClass('no-display');
      $view.find('#error-upload-title-label').removeClass('no-display');
      $('html, body').animate({scrollTop:290});

    }

    if(err.titleStatus){
      var $controlGroup =$view.find("#library-title").parent();
       var $errorEl = $("<span >", {id:"library-title-error-msg ",class: "col-sm-2.5 control-label help-inline", text: err.title});
      $controlGroup.addClass("has-error").append( $errorEl);

    }else{
       var $controlGroup =$view.find("#library-title").parent();
      $controlGroup.removeClass("has-error");
     $controlGroup.find(".help-inline").each(function() {
              $(this).remove();
          });

    }
    
  },

  onFormDataInvalid: function(errors) {
            var $view = this.$el;
            var clearFormErrors = function() {

                var $form = $view.find("form");
              
            }

            var markErrors = function(value, key) {
              var $controlGroup = $view.find("#library-" + key).parent();
              if( key == 'tags')
              {
                var $controlGroup = $view.find("#library_tags_tagsinput").parent();
              }

            $controlGroup.addClass("has-error");
               
            }
            clearFormErrors();
            _.each(errors, markErrors);
        } 

});

});

  
var setupLibrary =function(){
   Main.init();
   FormElements.init();
   $('#library-tags').tagsInput({ 
            width: 'auto'
        });
    $('#metaTable').editableTableWidget({ editor: $('<textarea>') });
    window.prettyPrint && prettyPrint();
}

function check_upload_file(event){
  var inputName = document.getElementById('fileToUpload');
     var imgPath;

     imgPath = inputName.value;
     alert(imgPath);

      str=document.getElementById('fileToUpload').value.toUpperCase();

      var suffix=["ZIP" ,"EPUB","RAR" ];
      var ft = str.substr(str.length - suffix.length);
      $('#error-upload-title-label').addClass('no-display');
      if(suffix.indexOf(ft) == -1){
           $('#error-uload-label').addClass('no-display').fadeIn(1);
           $('#error-uload-label').removeClass('no-display').fadeOut(5000);
          document.getElementById('fileToUpload').value='';
      }

}


