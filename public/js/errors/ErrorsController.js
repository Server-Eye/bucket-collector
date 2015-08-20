(function () {
    "use strict";

    angular.module('bucket-collector').controller('ErrorsController', ErrorsController);

    ErrorsController.$inject = ['ErrorsService', '$location', '$scope'];

    function ErrorsController(Errors, $location, $scope) {
        $scope.loaded = false;
        $scope.errors = [];
        $scope.bId = $location.absUrl().split('/').pop();
        $scope.getResponse = getResponse;
        
        function getResponse(response){
            if(angular.isString(response)){
                return response;
            } else {
                var resString = JSON.stringify(response, null, 4);
                console.log(resString);
                return resString;
            }
        }
        
        function refresh() {
            $scope.loaded = true;
            Errors.get($scope.bId).then(function(errors){
                errors.sort(function(a,b){
                   return b.date - a.date; 
                });
                $scope.errors = errors;
            }, function(err){
                
            });
        }

        refresh();
    }
})();