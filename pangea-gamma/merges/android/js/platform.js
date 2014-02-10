var platformSpecific = {
	support: {},
	init: function(viewsvc) {
		this.viewsvc = viewsvc;
		console.log('Platform-specific init:  android');
		viewsvc.setPlatform('android');

		for(var prop in this.support)
			if(this.support.hasOwnProperty(prop))
				this.support[prop].init(this);
	}
};

var screenOrientation = null;

platformSpecific.support.hardwareBackButton = {
	init: function(my) {
		document.addEventListener("backbutton", function(e){
			console.log('backbutton event fired');
			my.viewsvc.goBack();
		}, false);
	}
};


platformSpecific.support.orientation = {
	init: function() {}
	, lock: function(orientation) {
		if(screenOrientation)screenOrientation.set(orientation);
	}
	, unlock: function() {
		if(screenOrientation)screenOrientation.set('fullSensor');
	}

}



