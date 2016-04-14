(function() {
    "use strict";

    angular.module('bucket-collector').controller('ErrorsController', ErrorsController);

    ErrorsController.$inject = ['ErrorsService', '$location', '$scope'];

    function ErrorsController(Errors, $location, $scope) {
        $scope.loaded = false;
        $scope.errors = [];
        $scope.bId = $location.absUrl().split('/').pop();
        $scope.getErrorString = getErrorString;
        $scope.expand = expand;

        function expand(error) {
            if (!error.expanded)
                error.expanded = true;
            else
                error.expanded = false;
        }

        function getErrorString(error) {
            if (error.expanded) {
                var copy = angular.copy(error);

                delete(copy.expanded);
                delete(copy.$$hashkey);

                var resString = JSON.stringify(copy, null, 4);
                return resString;
            } else {
                if (angular.isString(error.message)) {
                    return error.message.substring(0, 500);
                } else {
                    return JSON.stringify(error.response, null, 4).substring(0, 500);
                }
            }
        }

        function refresh() {
            $scope.loaded = true;
            Errors.get($scope.bId).then(function(errors) {
                errors.sort(function(a, b) {
                    return b.date - a.date;
                });
                $scope.errors = errors;
            }, function(err) {

            });
        }

        refresh();
    }
})();