(function() {
    'use strict';

    var template =
    '<div>' +
       '<carousel disable-animation="true">' +
            '<slide ng-repeat="slide in slides" active="slide.active">' +
                '<img ng-src="{{slide.image}}" style="margin:auto;">' +
                '<div class="carousel-caption">' +
                    '<h4>Slide {{$index + 1}}</h4>' +
                '</div>' +
            '</slide>' +
        '</carousel>' +
    '</div>';

    angular.module('app').directive('ggCarousel', ggCarousel);

    function ggCarousel() {
        return {
            restrict: 'E',
            template: template,
            sciope: {
                slides: '='
            }
        };
    }
})();
