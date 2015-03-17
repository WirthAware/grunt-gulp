(function () {
    'use strict';
    var controllerId = 'gulp';
    angular.module('app').controller(controllerId, [gulp]);

    function gulp() {
        var vm = this;

        vm.slides =
        [
            {
                text: 'Eins',
                image: 'img/AngularJS-small.png',
            },
            {
                text: 'Zwei',
                image: 'img/gg.png',
            },
        ];
    }
})();
