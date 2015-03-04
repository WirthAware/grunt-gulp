(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, [dashboard]);

    function dashboard() {
        var vm = this;
        vm.my_markdown = "*This* **is** [markdown](https://daringfireball.net/projects/markdown/)";
    }
})();
