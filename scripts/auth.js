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
                // Sets user to falsy if no authData received, indicated that the user is logged out
                $scope.setUser(false);
            } else {
                // Creates a matching ACL entry for this successful login
                var acl = $firebaseObject(new Firebase(firebaseRoot + 'acl/' + authData.uid));
                acl.$loaded().then(function(acl) { 
                    acl.lastLogin = (new Date()).toString();
                    acl.provider = authData.provider;

                    if (authData.provider == 'password') {
                        acl.email = authData.password.email;
                    } else if (authData.provider == 'google') {
                        acl.email = authData.google.email;
                    } else if (authData.provider == 'facebook') {
                        acl.email = authData.facebook.email;
                    }

                    acl.$save();
                });

                // Will trigger if a userKey exists or once it has been created.
                var userKey = $firebaseObject(new Firebase(firebaseRoot + 'acl/' + authData.uid + '/userKey'));
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