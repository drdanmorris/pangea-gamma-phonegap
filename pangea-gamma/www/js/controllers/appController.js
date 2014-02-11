(function(){

function platformComplianceCheck($animate, $scope) {

	var feedback = null,  
		platform = device.platform.toLowerCase(), 
		version = new Version(device.version);

		// **********************TEST***********************
		//platform = 'android';
		//version = new Version('2.2.5');
		// **********************TEST***********************


	if(platform === 'android') {
		if(version.isLessThan('2.3.0')) {
			feedback = 'Minumum Android version 2.3.0 (Gingerbread)';
		}
		else if(version.isLessThan('3')) {
			console.log('disabling animation for android < 3');
			$animate.enabled(false);
		}
	}

	if(feedback) {
		$scope.platformErrorMessage = feedback;
		$scope.platformErrorClass = 'platformError';
		return false;
	}


	return true;  // all ok

};

controllers.controller('AppController', ['$scope', '$rootScope', 'ViewService', '$location', '$animate',
	function ($scope, $rootScope, viewsvc, $location, $animate) {
		
		if(window.platformSpecific) window.platformSpecific.init(viewsvc);

		if(!platformComplianceCheck($animate, $scope)) {
			return;
		}

		$scope.navigation = viewsvc;
		$scope.user = {
			balance: 44444.44,
			available: 98246.48,
			pnl:-3925.99,
			ntr:-1291.34
		};


		$scope.onTabSelected = function (idx) {
			viewsvc.navigateTab(idx);
		};
		$scope.showSearch = function() {
			viewsvc.bannerClass = 'search';
		};
		$scope.showSummary = function() {
			viewsvc.bannerClass = 'summary';
		};
		
		window.appController = this;
		this.viewsvc = viewsvc;
		viewsvc.init();

		this.handleOrientationChange = function(orientation) {
			$rootScope.orientation = orientation;
			$rootScope.isPortrait = orientation === 'portrait';
			$rootScope.isLandscape = !$rootScope.isPortrait;
			viewsvc.handleOrientationChange(orientation);
		}

		this.handleOrientationChange('portrait');

	}

]);

})();  //closure
