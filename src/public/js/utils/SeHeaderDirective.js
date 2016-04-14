(function() {
    "use strict";

    angular.module('bucket-collector').directive('seHeader', seHeader);

    function seHeader() {
        return {
            restrict: 'E',
            templateUrl: '/partials/seHeader'
        };
    }
})();