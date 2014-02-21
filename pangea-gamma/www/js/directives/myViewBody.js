directives.directive('myViewBody', function() {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'partials/myViewBody.html'
	};
});