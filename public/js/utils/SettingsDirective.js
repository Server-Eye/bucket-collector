(function () {
    "use strict";

    angular.module('bucket-collector').directive('settings', settings);
    
    function settings() {
        return {
            restrict: 'E',
            link: link,
            templateUrl: 'partials/settings'
        };
        
        function link(scope, element, attrs) {
            
        }
    }
})();