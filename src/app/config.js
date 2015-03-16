(function () {
    'use strict';

    var app = angular.module('app');

    var config = {};
    app.value('config', config);

    app.config(['markedProvider', function (markedProvider) {
        markedProvider.setOptions({gfm: true});
    }]);
})();
