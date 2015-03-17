(function () {
    'use strict';
    var controllerId = 'grunt';
    angular.module('app').controller(controllerId, [grunt]);

    function grunt() {
        var vm = this;

        vm.slides =
        [
            {
                image: '/img/grunt1.PNG'
            },
            {
                image: '/img/grunt2.PNG'
            },
        ];
    }
})();
