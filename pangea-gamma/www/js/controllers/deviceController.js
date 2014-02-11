controllers.controller('DeviceController', ['$scope', '$rootScope', 'ViewService',
	function ($scope, $rootScope, viewsvc) {
		viewsvc.unlockOrientation();

		if(typeof device != 'undefined') {
			$scope.name = device.name;
			$scope.phonegap = device.phonegap;
			$scope.platform = device.platform;
			$scope.uuid = device.uuid;
			$scope.version = device.version;
		}

		var vref = viewsvc.vref;
		if(vref.subtype === 'info') {

		}
		else {

		}

	}
]);