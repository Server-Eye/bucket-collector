(function () {
    "use strict";

    angular.module('bucket-collector').controller('MainController', MainController);

    MainController.$inject = ['BucketsService', 'SettingsService', '$scope'];

    function MainController(Buckets, Settings, $scope) {
        $scope.loaded = false;
        $scope.buckets = [];
        $scope.getLastResultIcon = getLastResultIcon;

        function getLastResultIcon(lastResult){
            var base = "glyphicon ";
            
            if(lastResult === "NONE"){
                return base + "glyphicon-question-sign color-working";
            }
            if(lastResult === "SUCCESS"){
                return base + "glyphicon-ok-sign color-ok";
            }
            if(lastResult === "NONE"){
                return base + "glyphicon-remove-sign color-error";
            }
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