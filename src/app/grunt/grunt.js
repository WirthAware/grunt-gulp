(function () {
    'use strict';
    var controllerId = 'grunt';
    angular.module('app').controller(controllerId, [grunt]);

    function grunt() {
        var vm = this;

        vm.slides =
        [
            {
                text: 'Ein',
                image: 'img/AngularJS-small.png',
            },
            {
                text: 'Zwei',
                image: 'img/gg.png',
            },
        ];
    }
})();
