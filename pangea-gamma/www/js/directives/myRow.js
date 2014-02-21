directives.directive('myRow', function() {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		templateUrl: 'partials/myRow.html'
	};
});