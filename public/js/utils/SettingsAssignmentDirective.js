(function () {
    "use strict";

    angular.module('bucket-collector').directive('settingsAssignment', settingsAssignment);
    function settingsAssignment() {
        return {
            restrict: 'E',
            scope: {
                scheme: '=',
                data: '='
            },
            link: link,
            templateUrl: '/partials/settingsAssignment'
        };
        
        function link(scope, element, attrs){
        }
    }
})();

