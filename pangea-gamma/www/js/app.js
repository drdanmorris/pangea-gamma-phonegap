'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'ngTouch',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'myApp.userControls'
]);


myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/:tab/menu/:subtype/:id', { templateUrl: 'partials/menu.html', controller: 'MenuController' })
        .when('/:tab/menupr/:subtype/:id', { templateUrl: 'partials/menupr.html', controller: 'PriceMenuController' })
        .when('/:tab/acct/:subtype/:id', { templateUrl: 'partials/picklist.html', controller: 'AccountController' })
        .when('/:tab/device/:subtype/:id', { templateUrl: 'partials/device.html', controller: 'DeviceController' })
        .when('/:tab/price/trade/:dref', { templateUrl: 'partials/priceTrade.html', controller: 'PriceTradeController' })
        .when('/:tab/price/chart/:dref', { templateUrl: 'partials/priceChart.html', controller: 'PriceChartController' })
        .otherwise({ redirectTo: '0/menu/usr/0' })
    ;
}]);



