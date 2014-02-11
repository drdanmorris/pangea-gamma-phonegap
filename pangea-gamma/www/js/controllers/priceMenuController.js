controllers.controller('PriceMenuController', ['$scope', '$rootScope', '$routeParams', 'ViewService', 'PushService',
	function ($scope, $rootScope, $routeParams, viewsvc, push) {

		$scope.menu = [];
		$scope.loading = true;
		$scope.navigation = viewsvc;
		var vref = 'menupr/' + $routeParams.subtype + '/' + $routeParams.id,
			scopeDrefIndex = {},
			viewData = null,
			first = true;


		var onUpdate = function(msg) {
			var item = scopeDrefIndex[msg.dref];
			item.sell = msg.sell;
			item.buy = msg.buy;
			item.chg = msg.chg;
			if(first) {
				applyUpdates();
				first = false;
			}
		};
		var applyUpdates = function() {
			$scope.$apply();
			resetChg();
			setTimeout(applyUpdates, 1000);
		};
		
		var resetChg = function() {
			for(var i = 0; i < viewData.items.length; i++){
				viewData.items[i].chg = 0;
			}
		};

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
		});

		viewsvc.currentViewController = this;

	}
]);