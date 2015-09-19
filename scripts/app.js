(function() {
    var app = angular.module('SlidesApp', ['firebase', 'ngMaterial']);

    app.constant('firebaseRoot', window.env.firebaseRoot);

    app.controller('AppCtrl', function($scope, $window, $mdSidenav, $mdToast) {

        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };

        $scope.setAuthObject = function(authObject) {
            $scope.authObject = authObject;
        };

        $scope.setUser = function(user) {
            if (user) {
                user.$bindTo($scope, 'user'); // Creates 3-way bind to from $scope.user to my-firebase.com/users/###userKey###
                user.$loaded().then(function(user) { // Waits for user object to be loaded from Firebase socket
                    console.info('user loaded!', user);
                });
            } else {
                $scope.user = false;
            }
        };

        $scope.alert = function (message) {
            $mdToast.show($mdToast.simple().content(message.toString()).position('false true true false').hideDelay(3000));
        };
    });
})();