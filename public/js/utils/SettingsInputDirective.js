(function () {
    "use strict";

    angular.module('bucket-collector').directive('settingsInput', settingsInput);
    function settingsInput() {
        return {
            restrict: 'E',
            scope: {
                scheme: '=',
                data: '='
            },
            link: link,
            templateUrl: '/partials/settingsInput'
        };
        
        function link(scope, element, attrs){
           
        }
    }
})();

