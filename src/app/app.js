(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules
        'ngRoute',          // routing
    ]);

    // Handle routing errors and success events
    app.run(['$route', function ($route) {
        // Include $route to kick start the router.
    }]);
})();
