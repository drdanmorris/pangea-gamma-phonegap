controllers.controller('MenuController', ['$scope', '$routeParams', 'ViewService', 'PushService',
	function ($scope, $routeParams, viewsvc, push) {
		$scope.navigation = viewsvc;
		var vref = 'menu/' + $routeParams.subtype + '/' + $routeParams.id;

		push.subscribe({ vref: vref }).then(function (view) {
			if(view.items) {
				for(var i = 0; i < view.items.length; i++){
					var item = view.items[i];
					if(!item.navigateVref && view.navigateVref) item.navigateVref = view.navigateVref + item.dref;
				}
				$scope.menu = view.items;
			}
			else {
				viewsvc.viewClass = 'oops';
			}
			if(toolbarController)
				toolbarController.setTitle(view.title);
		});

		viewsvc.currentViewController = this;

	}
]);
