(function () {
    "use strict";

    angular.module('bucket-collector').controller('SettingsController', SettingsController);

    SettingsController.$inject = ['SettingsService','$scope'];

    function SettingsController(Settings, $scope) {
        $scope.loaded = false;
        $scope.settings = {};
        $scope.login = {
            email: "",
            password: "",
            name: "",
            error: ""
        };
        $scope.resetKey = resetKey;
        $scope.newKey = newKey;
        $scope.applySettings = applySettings;
        
        Settings.get().then(function(settings){
           $scope.settings = settings;
           $scope.loaded = true;
           console.log($scope);
        });
        
        function resetKey() {
            $scope.settings.apiKey = null;
        }
        
        function newKey() {
            console.log($scope.login.email, $scope.login.password);
            Settings.getNewApiKey($scope.login.email, $scope.login.password, $scope.login.name).then(function(key){
                console.log("Got new apiKey: '" + key + "'");
                $scope.settings.apiKey = key;
                $scope.login.error = "";
            },function(err){ 
                console.log("ERR", err);
                $scope.login.error = err;
            });
        }
        
        function applySettings(){
            Settings.set($scope.settings).then(function (res){
                console.log(res);
            }, function(err){
                console.log(err);
            });
        }
    }
})();