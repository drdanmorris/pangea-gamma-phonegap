window.platformSpecific = {
	init: function(viewsvc) {
		document.addEventListener("backbutton", function(e){
			viewsvc.goBack();
		}, false);
		viewsvc.setPlatform('android');
	}
};
