directives.directive('myPanel', function() {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'partials/myPanel.html'
	};
});