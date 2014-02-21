controllers.controller('PriceMenuController', ['$scope', '$rootScope', '$routeParams', 'ViewService', 'PushService',
	
	function ($scope, $rootScope, $routeParams, viewsvc, push) {
		$scope.menu = [];
		$scope.loading = true;
		$scope.navigation = viewsvc;
		var vref = 'menupr/' + $routeParams.subtype + '/' + $routeParams.id,
			scopeDrefIndex = {},
			updateLoopStarted = false,
			stopUpdateLoop = false,
			viewData = null;

		console.log('PriceMenuController for ' + vref);

		var onUpdate = function(msg) {
			var item = scopeDrefIndex[msg.dref];
			item.sell = msg.sell;
			item.buy = msg.buy;
			item.chg = msg.chg;
		};
		var applyUpdates = function(start) {
			if(stopUpdateLoop) return;
			if(start) {
				if(updateLoopStarted) return;
				console.log('starting update loop');
			}

			$scope.$apply();
			resetChg();
			setTimeout(applyUpdates, 1000);
			updateLoopStarted = true;
		};
		var resetChg = function() {
			for(var i = 0; i < viewData.items.length; i++){
				viewData.items[i].chg = 0;
			}
		};

		this.pause = function() {
			console.log('pausing update loop');
			stopUpdateLoop = true;
			updateLoopStarted = false;
		};

		this.resume = function() {
			stopUpdateLoop = false;
			console.log('resubscribing');
			this.subscribe();
		};

		this.subscribe = function() {
			var my = this;
			push.subscribe({ vref:vref, delegate:onUpdate }).then(function (view) {
				viewData = view;
				// create dref index to aid later scope updating
				if(view.items) {
					for(var i = 0; i < view.items.length; i++){
						var item = view.items[i];
						scopeDrefIndex[item.dref] = item;
						item.chg = 0;
						if(!item.navigateVref && view.navigateVref) item.navigateVref = view.navigateVref + item.dref;
					}
					$scope.menu = view.items;
				}
				toolbarController.setTitle(view.title);
				$scope.loading = false;
				applyUpdates(true);
			});
		};
		this.subscribe();
		viewsvc.currentViewController = this;
	}


]);