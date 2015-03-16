(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, [dashboard]);

    function dashboard() {
        var vm = this;
        vm.myMarkdown = '*This* **is** [markdown](https://daringfireball.net/projects/markdown/)';
    }
})();
