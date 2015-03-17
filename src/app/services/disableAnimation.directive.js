// This directive is only needed because of the bug when using ui.bootstrap carousel and ngAnimate module
// please refer to https://github.com/angular-ui/bootstrap/issues/1350

(function() {
    'use strict';

    angular.module('app').directive('disableAnimation', ['$animate', disableAnimation]);

    function disableAnimation($animate) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attrs) {
                $attrs.$observe('disableAnimation', function(value) {
                    $animate.enabled(!value, $element);
                });
            }
        };
    }
})();
