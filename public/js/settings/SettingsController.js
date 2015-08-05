(function () {
    "use strict";

    angular.module('bucket-collector').controller('SettingsController', SettingsController);

    SettingsController.$inject = ['SettingsService','$scope'];

    function SettingsController(Settings, $scope) {
        $scope.loaded = false;
        $scope.settings = {};
        
        Settings.get().then(function(settings){
           $scope.settings = settings;
           $scope.loaded = true;
           console.log($scope);
        });
    }
})();