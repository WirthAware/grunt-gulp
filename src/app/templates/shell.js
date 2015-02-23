(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['$rootScope', shell]);

    function shell($rootScope, common, config) {
        var vm = this;
        vm.title = 'Grunt & Gulp';
    }
})();
