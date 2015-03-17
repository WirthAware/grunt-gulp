(function () {
    'use strict';
    var controllerId = 'gulp';
    angular.module('app').controller(controllerId, [gulp]);

    function gulp() {
        var vm = this;

        vm.slides =
        [
            {
                image: 'img/gulp1.png',
            },
            {
                image: 'img/gulp2.png',
            },
            {
                image: 'img/gulp3.png',
            },
            {
                image: 'img/gulp4.png',
            },
        ];
    }
})();
