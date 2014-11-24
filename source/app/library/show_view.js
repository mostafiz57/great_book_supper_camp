App.module("LibraryApp.Show", function(Show, App, Backbone, Marionette, $, _){
  Show.Layout = Marionette.Layout.extend({
    template: "#library-show-layout",
		onShow : function(){
			 $('body').removeClass('login example2');
			 setupLibraryView();
		},
        regions: {
             LibraryTopViewRegion: "#library-top-view-region",
             LibraryBottomViewRegion: "#library-bottom-view-region"

        }
  });

Show.libraryTopView = Marionette.ItemView.extend({
	template: "#library-top-view-panel"

});

Show.libraryBottomView = Marionette.ItemView.extend({
	template: "#library-bottom-view-panel"

});

});

  
var setupLibraryView =function(){
    Main.init();
    TableData.init();
    FormElements.init();
}
