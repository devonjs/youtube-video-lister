(function(){
    "use strict";
    var app = angular.module("jukinApp", [
        "ngRoute"
    ]);
    
    app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider){
        $routeProvider 
            .when("/", {
                templateUrl: "views/home/home.html",
                controller: "HomeController",
                controllerAs: "home"
            })
            .otherwise({
                redirectTo: "/"
            });
            
        $locationProvider.html5Mode(true);
    }]);
})();