(function () {
    "use strict";

    angular.module('bucket-collector').controller('AdditionalSettingsController', AdditionalSettingsController);

    AdditionalSettingsController.$inject = ['$scope', '$location', '$q', 'SchemeService', 'ReactionDataService'];

    function AdditionalSettingsController($scope, $location, $q, Scheme, ReactionData) {
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
                $scope.loaded = true;
            });
        }
        
        init();
    }
})();