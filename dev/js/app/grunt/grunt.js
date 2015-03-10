(function () {
    'use strict';
    var controllerId = 'grunt';
    angular.module('app').controller(controllerId, [grunt]);

    function grunt() {
        var vm = this;
    }
})();
