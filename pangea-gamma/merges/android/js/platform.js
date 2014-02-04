window.platformSpecific = {
	init: function(viewsvc) {
		console.log('Platform-specific init:  android');
		document.addEventListener("backbutton", function(e){
			//alert('backbutton');
			console.log('backbutton event fired');
			viewsvc.goBack();
		}, false);
		viewsvc.setPlatform('android');
	}
};
