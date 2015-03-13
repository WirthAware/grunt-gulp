(function () {
    'use strict';
    var controllerId = 'grunt';
    angular.module('app').controller(controllerId, [grunt]);

    function grunt() {
        var vm = this;

        vm.slides =
        [
            {
                text: 'Eins',
                image: 'http://placekitten.com/' + 601 + '/300',
                markdown: 'src/app/gulp/slides/slide1.md'
            },
            {
                text: 'Zwei',
                image: 'http://placekitten.com/' + 602 + '/300',
                markdown: 'src/app/gulp/slides/slide2.md'
            },
        ];
    }
})();
