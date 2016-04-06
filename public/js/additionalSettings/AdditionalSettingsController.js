(function () {
    "use strict";

    angular.module('bucket-collector').controller('AdditionalSettingsController', AdditionalSettingsController);

    AdditionalSettingsController.$inject = ['$scope', '$location', '$q', 'SchemeService', 'SchemeDataService', 'ReactionDataService'];

    function AdditionalSettingsController($scope, $location, $q, Scheme, SchemeData, ReactionData) {
        $scope.reactionName = $location.absUrl().split('/').pop();
        $scope.loaded = false;
        $scope.applySettings = applySettings;


        function init() {
            $scope.loaded = false;
            Scheme($scope.reactionName).then(function (res) {
                $scope.schemes = res;
                $scope.data = {};
                angular.forEach($scope.schemes, function (scheme) {
                    $scope.data[scheme.name] = undefined;
                });
                return ReactionData.get($scope.reactionName);
            }).then(function (res) {
                angular.forEach(res, function (val, key) {
                    $scope.data[key] = val;
                });
                console.log($scope.data);
            }).then(function () {
                angular.forEach($scope.schemes, function (scheme) {
                    if (scheme.data) {
                        SchemeData($scope.reactionName, scheme.data).then(function (data) {
                            scheme.possibleValues = data;
                        });
                    }
                });

                $scope.loaded = true;
            });
        }

        function applySettings(){
            console.log($scope.data);
        }
        
        init();
    }
})();