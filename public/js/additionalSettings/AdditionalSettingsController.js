(function () {
    "use strict";

    angular.module('bucket-collector').controller('AdditionalSettingsController', AdditionalSettingsController);

    AdditionalSettingsController.$inject = ['$scope', '$location', '$q', 'SchemeService', 'SchemeDataService', 'ReactionDataService'];

    function AdditionalSettingsController($scope, $location, $q, Scheme, SchemeData, ReactionData) {
        $scope.reactionName = $location.absUrl().split('/').pop();
        $scope.loaded = false;


        function init() {
            $scope.loaded = false;
            $q.all([
                Scheme($scope.reactionName).then(function (res) {
                    $scope.schemes = res;
                }),
                ReactionData.get($scope.reactionName).then(function (res) {
                    $scope.data = res;
                })
            ]).then(function () {
                angular.forEach($scope.schemes, function (scheme) {
                    if (scheme.data) {
                        SchemeData($scope.reactionName, scheme.data).then(function(data){
                            scheme.possibleValues = data;
                        });
                    }
                });
                
                $scope.loaded = true;
            });
        }
        
        init();
    }
})();