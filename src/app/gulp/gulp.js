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
                image: 'http://placekitten.com/' + 601 + '/300',
            },
            {
                text: 'Zwei',
                image: 'http://placekitten.com/' + 602 + '/300',
            },
        ];
    }
})();
