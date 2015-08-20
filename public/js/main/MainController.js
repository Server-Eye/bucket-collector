(function () {
    "use strict";

    angular.module('bucket-collector').controller('MainController', MainController);

    MainController.$inject = ['BucketsService', 'SettingsService', '$window', '$scope'];

    function MainController(Buckets, Settings, $window, $scope) {
        $scope.loaded = false;
        $scope.buckets = [];
        $scope.getLastResultIcon = getLastResultIcon;
        $scope.redirect = redirect;

        function getLastResultIcon(lastResult){
            var base = "glyphicon ";
            
            if(lastResult === "NONE"){
                return base + "glyphicon-question-sign color-working";
            }
            if(lastResult === "SUCCESS"){
                return base + "glyphicon-ok-sign color-ok";
            }
            if(lastResult === "FAILED"){
                return base + "glyphicon-remove-sign color-error";
            }
        }
        
        function redirect(path){
            $window.location.href = path;
        }

        function refresh() {
            Settings.get().then(function (settings) {
                Buckets.getActiveStats(settings.apiKey).then(function (buckets){
                    console.log(buckets);
                    
                    $scope.buckets = buckets;
                    $scope.loaded = true;
                });
            });
        }

        refresh();
    }
})();