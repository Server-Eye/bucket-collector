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
            scope.first = undefined;
            scope.second = undefined;
            console.log(scope);
            
            scope.selectFirst = function (data){
                scope.first = data[scope.scheme.data[0].dataValue];
                console.log(data);
                checkComplete();
            };
            
            scope.selectSecond = function (data){
                scope.second = data[scope.scheme.data[1].dataValue];
                console.log(data);
                checkComplete();
            };
            
            function checkComplete(){
                if(scope.first && scope.second){
                    scope.data = {};
                    scope.data[scope.first] = scope.second;
                }
            }
            
            
        }
    }
})();

