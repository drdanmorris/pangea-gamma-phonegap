controllers.controller('UserSummaryController', ['$scope', '$rootScope', 'ViewService', 'PushService', 'EventService',
	function ($scope, $rootScope, viewsvc, push, eventSvc) {
		
		// todo...
		// subscribe
		// bind $scope

		// $scope.user = {
		// 	balance: 44444.44,
		// 	available: 98246.48,
		// 	pnl:-3925.99,
		// 	ntr:-1291.34
		// };

		var viewData = null;

	

		$scope.showSearch = function() {
			$scope.bannerClass = 'search';
		};
		$scope.showSummary = function() {
			$scope.bannerClass = 'summary';
		};
		$scope.doSearch = function() {
			// todo
		};


		this.onPause = function(){

		};

		this.onResume = function(){

		};

		eventSvc.onPause(this.onPause.bind(this));
		eventSvc.onResume(this.onResume.bind(this));

		var onUpdate = function(msg) {
			for(prop in viewData)
				if(viewData.hasOwnProperty(prop))
					viewData[prop] = msg[prop];
			$scope.$apply();
		};

		this.subscribe = function() {
			var my = this;
			push.register({ vref:'user/position/up100', delegate:onUpdate }).then(function (view) {
				viewData = $scope.user = view.item;
			});
		};

		this.subscribe();


	}
]);