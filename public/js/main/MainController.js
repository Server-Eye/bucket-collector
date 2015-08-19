(function () {
    "use strict";

    angular.module('bucket-collector').controller('MainController', MainController);

    MainController.$inject = ['BucketsService', 'SettingsService', '$scope'];

    function MainController(Buckets, Settings, $scope) {
        Settings.get().then(function(settings){
            Buckets.getActive(settings.apiKey).then(function(buckets){
                console.log(buckets);
            });
            
        });
    }
})();