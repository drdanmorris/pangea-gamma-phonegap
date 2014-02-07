
// Orientation support (iOS)
// 1 = UIInterfaceOrientationPortrait
// 2 = UIInterfaceOrientationPortraitUpsideDown
// 3 = UIInterfaceOrientationLandscapeLeft
// 4 = UIInterfaceOrientationLandscapeRight

// iOS will call this method when the device orientation has changed. Returning false will 
// prevent a UI orientation change.
function shouldRotateToOrientation(interfaceOrientation) {
	console.log('shouldRotateToOrientation ' +  interfaceOrientation);
	return (platformSpecific.support.orientation.canRotate); 
}


var platformSpecific = {
	support: {},
	init: function(viewsvc) {
		console.log('Platform-specific init:  ios');
		viewsvc.setPlatform('ios');

		for(var prop in this.support)
			if(this.support.hasOwnProperty(prop))
				this.support[prop].init();
	}
};

platformSpecific.support.orientation = {
	init: function() {}
	, canRotate: false
	, lock: function(orientation) {
		this.canRotate = false;
	}
	, unlock: function() {
		this.canRotate = true;
	}

}

