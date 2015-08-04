(function () {
    "use strict";

    angular.module('bucket-collector').directive('login', login);
    
    function login() {
        return {
            restrict: 'E',
            link: link,
            templateUrl: 'partials/login'
        };
        
        function link(scope, element, attrs) {
            
        }
    }
})();