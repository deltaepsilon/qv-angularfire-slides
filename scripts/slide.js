(function() {
    angular.module('SlidesApp').controller('SlideCtrl', function($scope, firebaseRoot, $firebaseArray, $firebaseObject) {
        var slidesRef = new Firebase(firebaseRoot + 'slides'),
            slides = $firebaseArray(slidesRef);

        $scope.slides = slides;

        slides.$loaded().then(function(slides) {
            $scope.selectSlide($scope.$index);
        });

        $scope.selectSlide = function(index) {
            if (slides.length) {
                var slideRef = $firebaseObject(new Firebase(firebaseRoot + 'slides/' + slides[index].$id));
                slideRef.$bindTo($scope, 'slide');
            }
        };

        $scope.removeSlide = function (index) {
            slides.$remove(index);
        };

    });
})();