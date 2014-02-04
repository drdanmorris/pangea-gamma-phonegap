'use strict';

var controllers = angular.module('myApp.controllers', []);

controllers.controller('AppController', ['$scope', '$rootScope', 'ViewService', '$location',
	function ($scope, $rootScope, viewsvc, $location) {
		
		if(window.platformSpecific) window.platformSpecific.init(viewsvc);

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
		$scope.platform = function(platform) {
			viewsvc.setPlatform(platform);
		}
		window.appController = this;
		this.viewsvc = viewsvc;
		viewsvc.setMainHeight();
		window.appController = this;

		this.handleOrientationChange = function(orientation) {
			//alert(orientation);
			viewsvc.handleOrientationChange(orientation);
			$scope.$apply()
		}
	}

]);


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


controllers.controller('AccountController', ['$scope',
	function ($scope) {
		// todo...
	}
]);


controllers.controller('ChartController', ['$scope',
	function ($scope) {
		// todo...
	}
]);

var toolbarController;
controllers.controller('ToolbarController', ['$scope', 'ViewService',
	function ($scope, viewsvc) {
		
		console.log('ToolbarController ctor');

		$scope.back = '';
		$scope.title = 'title';

		var ToolbarItem = function(options) {
			options = angular.extend({
				name: 'off'
			}, options);
			this.name = options.name;
		};

		var toolbarItems = [];
		for(var i = 0; i < 5; i++) {
			toolbarItems.push(new ToolbarItem());
		}

		$scope.toolbarItems = toolbarItems;

		$scope.goBack = function () {
			viewsvc.goBack();
		};

		this.setBack = function(back) {
			$scope.back = back;
		};
		this.setTitle = function(title) {
			$scope.title = title;
		};
		this.getTitle = function(title) {
			return $scope.title;
		};
		this.getTitleForward = function(title) {
			$scope.back = $scope.title;
			return $scope.title;
		};
		this.setToolbarItems = function(items) {
			for(var i = 0; i < items.length; i++) {
				toolbarItems[i].name = items[i].name;
			}
		}
		this.resetToolbarItems = function(items) {
			for(var i = 0; i < toolbarItems.length; i++) {
				toolbarItems[i].name = 'off';
			}
		}
		this.setTitleAndToolbarItems = function(title, items) {
			this.setTitle(title);
			this.setToolbarItems(items);
		};
		
		this.setTitle('toolbar');
		toolbarController = this;
	}
]);



controllers.controller('PriceTradeController', ['$scope', '$rootScope', '$routeParams', 'ViewService', 'PushService',
	function ($scope, $rootScope, $routeParams, viewsvc, push) {
		var vref = 'price/trade/'+ $routeParams.dref,
			viewdata = null,  // set from push result
			dp = 2,
			first = true
		;
		var onUpdate = function(msg) {
			if(!first) return;  // stop applying subsequent updates
			$scope.buy = splitPriceMajorMinor(msg.buy);
			$scope.sell = splitPriceMajorMinor(msg.sell);
			updateStopInfo();
			updateLimitInfo();
			if(!first) $scope.$apply();
			first = false;
		};
		var splitPriceMajorMinor = function(price) {
			price = price || '0.0';
			var parts = price.split('.');
			return {
				major: parts[0],
				minor: parts[1],
				raw: price,
				value: parseFloat(price)
			};
		};
		var updateStopInfo = function() {
			$scope.stopUpDownCtrl.levelAmount.numerator = $scope.sellStop = ($scope.sell.value + $scope.stopUpDownCtrl.value).toFixed(dp);
			$scope.stopUpDownCtrl.levelAmount.denominator = $scope.buyStop = ($scope.buy.value - $scope.stopUpDownCtrl.value).toFixed(dp);
			$scope.stopUpDownCtrl.levelAmount.value = -$scope.stopUpDownCtrl.value;
		};
		var updateLimitInfo = function() {
			$scope.limitUpDownCtrl.levelAmount.numerator = $scope.sellLimit = ($scope.sell.value - $scope.limitUpDownCtrl.value).toFixed(dp);
			$scope.limitUpDownCtrl.levelAmount.denominator = $scope.buyLimit = ($scope.buy.value + $scope.limitUpDownCtrl.value).toFixed(dp);
			$scope.limitUpDownCtrl.levelAmount.value = $scope.limitUpDownCtrl.value;
		};

		$scope.navigation = viewsvc;
		$scope.loading = true;
		$scope.sizeUpDownCtrl = new numericUpDownControl({
			title: 'Size',
			increment: 1
		});
		$scope.stopUpDownCtrl = new numericUpDownControl({
			title: 'Stop',
			increment: 10,
			onUp: function() {
				updateStopInfo();
			},
			onDown: function() {
				updateStopInfo();
			},
			levelAmount : {
				numerator:0,
				denominator:0
			}
		});
		$scope.limitUpDownCtrl = new numericUpDownControl({
			title: 'Limit',
			increment: 1,
			onUp: function() {
				updateLimitInfo();
			},
			onDown: function() {
				updateLimitInfo();
			},
			levelAmount : {
				numerator:0,
				denominator:0
			}
		});
		$scope.guaranteed = {
			position:'off'
		}

		
		push.subscribe({ vref:vref, delegate:onUpdate }).then(function (view) {
			// return;
			viewdata = view;
			onUpdate(view.item);
			$scope.title = view.item.title;
			$scope.icon1 = view.icon1;
			$scope.icon2 = view.icon2;
			toolbarController.setTitleAndToolbarItems('Trade', [{name:'chart'}]);
			$scope.loading = false;
		});

		viewsvc.currentViewController = this;

	}
]);

