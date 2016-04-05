(function () {
    "use strict";

    angular.module('bucket-collector').directive('settingsSelect', settingsSelect);
    function settingsSelect() {
        return {
            restrict: 'E',
            scope: {
                scheme: '=',
                data: '='
            },
            link: link,
            templateUrl: '/partials/settingsSelect'
        };
        
        function link(scope, element, attrs){
            console.log(scope);
            
            scope.select = function (data){
                scope.data = data[scope.scheme.data.dataValue];
                console.log(data);
            };
        
        }
    }
})();

