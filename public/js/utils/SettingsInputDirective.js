(function () {
    "use strict";

    angular.module('bucket-collector').directive('settingsInput', settingsInput);
    function settingsInput() {
        return {
            restrict: 'E',
            scope: {
                scheme: '=',
                returnData: '='
            },
            link: link,
            templateUrl: '/partials/settingsInput'
        };
        
        function link(scope, element, attrs){
            scope.data = {
                input: ""
            };
            if(!scope.scheme.multiple){
                scope.data.input = scope.returnData;
                scope.$watch('data.input', function(){
                    scope.returnData = scope.data.input;
                });
            } else {
                if(!angular.isArray(scope.returnData)){
                    scope.returnData = [];
                }
            }
            scope.add = function (){
                    console.log(scope.data);
                    if((scope.returnData.indexOf(scope.data.input) < 0) && (scope.data.input != "")){
                        scope.returnData.push(scope.data.input);
                        scope.data.input = "";
                    }
                };
            
            scope.remove = function (value) {
                var idx = scope.returnData.indexOf(value);

                if (idx >= 0) {
                    scope.returnData.splice(idx, 1);
                }
            };
            
            scope.getInputClass = function(){
                return scope.form.input.$valid ? "" : "has-error";
            };
            
            scope.getClass = function(){
                return scope.scheme.multiple ? "col-sm-9" : "col-sm-12";
            };
        }
    }
})();

