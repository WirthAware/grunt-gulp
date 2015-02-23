(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // Define the routes
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'src/app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            },
            {
                url: '/gulp',
                config: {
                    title: 'Gulp',
                    templateUrl: 'src/app/gulp/gulp.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Gulp'
                    }
                }
            },
            {
                url: '/grunt',
                config: {
                    title: 'Grunt',
                    templateUrl: 'src/app/grunt/grunt.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Grunt'
                    }
                }
            }
        ];
    }
})();
