(function () {
    "use strict";

    angular.module('bucket-collector').controller('AdditionalSettingsController', AdditionalSettingsController);

    AdditionalSettingsController.$inject = ['$scope', '$location', 'SchemeService', 'ReactionDataService'];

    function AdditionalSettingsController($scope, $location, Scheme, ReactionData) {
        $scope.reactionName = $location.absUrl().split('/').pop();
        $scope.loaded = false;
        
        Scheme($scope.reactionName).then(function(res){
            $scope.schemes = res;
            $scope.loaded = true;
        });
        
        ReactionData.get($scope.reactionName).then(function(res){
            $scope.data = res;
        });
    }
})();