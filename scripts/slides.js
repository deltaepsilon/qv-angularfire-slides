(function() {
    angular.module('SlidesApp').controller('SlidesCtrl', function($scope, firebaseRoot, $firebaseArray, $firebaseObject) {
        var slidesRef = new Firebase(firebaseRoot + 'slides'),
            slides = $firebaseArray(slidesRef);

        $scope.slides = slides;

        $scope.addSlide = function(title) {
            slides.$add({
                title: title
            });
        };

    });
})();