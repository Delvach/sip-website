//$locationProvider.html5Mode(true).hashPrefix('!');

var sipApp = angular.module('sipMenu', [])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.
            when('/', {templateUrl: 'partials/carousel.html', controller: CarouselCtrl}).
            when('/coffee', {templateUrl: 'partials/menu.html', controller: CoffeeMenuCtrl}).
            otherwise({redirectTo: '/'});
}]);

function NavCtrl($scope, $http, $location) {
//    console.log($location);
    $http.get('/data/nav.json')
       .then(function(res){
          $scope.nav = res.data;
//          console.log(res);
        });

    $scope.nav = [
        {title:"One"},
        {title:"Two"}
    ];
}

function CarouselCtrl($scope, $http) {

}

function CoffeeMenuCtrl($scope, $http) {
    $scope.title = "Le Coffee Menu";
    $http.get('/data/coffee.json')
       .then(function(res){
          $scope.menu = res.data;
          console.log($scope.menu);
        });

}