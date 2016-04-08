(function () {
    "use strict";

    angular.module('bucket-collector').controller('MainController', MainController);

    MainController.$inject = ['BucketsService', 'SettingsService', '$interval', '$window', '$scope'];

    function MainController(Buckets, Settings, $interval, $window, $scope) {
        var _settings = null;
        $scope.loaded = false;
        $scope.buckets = [];
        $scope.getLastResultIcon = getLastResultIcon;
        $scope.redirect = redirect;
        $scope.refresh = refresh;

        function getLastResultIcon(lastResult) {
            var base = "glyphicon ";

            if (lastResult === "NONE") {
                return base + "glyphicon-question-sign color-working";
            }
            if (lastResult === "SUCCESS") {
                return base + "glyphicon-ok-sign color-ok";
            }
            if (lastResult === "FAILED") {
                return base + "glyphicon-remove-sign color-error";
            }
        }

        function redirect(path) {
            $window.location.href = path;
        }

        function init() {
            Settings.get().then(function (settings) {
                _settings = settings;
                refresh();
                $interval(refresh, 60000);
            });
        }

        function refresh() {
            console.log("refresh");
            $scope.loaded = false;
            Buckets.getActiveStats(_settings.apiKey).then(function (buckets) {
                $scope.buckets = buckets;
                $scope.loaded = true;
            });
        }

        init();
    }
})();