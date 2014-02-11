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
