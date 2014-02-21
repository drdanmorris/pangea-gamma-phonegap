directives.directive('myLevelAmount', function() {
	return {
		restrict: 'E',
		scope: {
			ctrl: '='
		},
		replace: true,
		templateUrl: 'partials/myLevelAmount.html'
	};
});
