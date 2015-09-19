(function() {
    angular.module('SlidesApp').controller('AuthCtrl', function($scope, $firebaseAuth, $firebaseObject, firebaseRoot) {
        var ref = new Firebase(firebaseRoot),
            authObject = $firebaseAuth(ref);

        $scope.setAuthObject(authObject);

        $scope.google = function() {
            authObject.$authWithOAuthPopup('google', {
                scope: 'email'
            }).then(function(authData) {
                console.log('google success', authData);
            }, function(err) {
                console.warn('google error', err);
            });
        };

        $scope.facebook = function() {
            authObject.$authWithOAuthPopup('facebook', {
                scope: 'email'
            }).then(function(authData) {
                console.log('facebook success', authData);
            }, function(err) {
                console.warn('facebook error', err);
            });
        };

        $scope.login = function(loginUser) { // loginUser = {email: 'someemail@gmail.com', password: 'somepassword'};
            authObject.$authWithPassword(loginUser).then(function() {
                $scope.alert('Login successful!');
            }, function(error) {
                $scope.alert(error);
            });
        };

        $scope.register = function(loginUser) { // loginUser = {email: 'someemail@gmail.com', password: 'somepassword'};
            authObject.$createUser(loginUser).then(function() {
                $scope.login(loginUser);
            }, function(error) {
                $scope.alert(error);
            });
        };

        authObject.$onAuth(function(authData) {
            console.info('authData received', authData);
            if (!authData) {
                $scope.setUser(false);
            } else {
                var userKey = $firebaseObject(new Firebase(firebaseRoot + 'acl/' + authData.uid + '/userKey')),
                    lastLogin = $firebaseObject(new Firebase(firebaseRoot + 'acl/' + authData.uid + '/lastLogin'));

                lastLogin.$value = (new Date()).toString();
                lastLogin.$save();

                userKey.$watch(function() {
                    if (userKey.$value) {
                        var userRef = new Firebase(firebaseRoot + 'users/' + userKey.$value),
                            user = $firebaseObject(userRef);

                        $scope.setUser(user);
                    }
                });
            }
        });
    });
})();