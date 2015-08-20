(function () {
    "use strict";

    angular.module('bucket-collector').controller('SettingsController', SettingsController);

    SettingsController.$inject = ['SettingsService', 'BucketsService', '$window', '$scope'];

    function SettingsController(Settings, Buckets, $window, $scope) {
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

        $scope.$watch("buckets", function (newVal, oldVal) {

            $scope.settings.activeBucketIds = [];
            angular.forEach(newVal, function (bucket) {
                if (bucket.active) {
                    $scope.settings.activeBucketIds.push(bucket.bId);
                }
            });

        }, true);

        function init() {
            Settings.get().then(function (settings) {
                $scope.settings = settings;
                $scope.loaded = true;
            }).then(function () {
                console.log("here");
                if ($scope.settings.apiKey) {
                    Buckets.getAll($scope.settings.apiKey).then(function (buckets) {
                        $scope.buckets = buckets;
                    });
                }
            });
        }

        init();

        function resetKey() {
            $scope.settings.apiKey = null;
        }

        function newKey() {
            console.log($scope.login.email, $scope.login.password);
            Settings.getNewApiKey($scope.login.email, $scope.login.password, $scope.login.name).then(function (key) {
                console.log("Got new apiKey: '" + key + "'");
                $scope.settings.apiKey = key;
                $scope.login.error = "";
                init();
            }, function (err) {
                console.log("ERR", err);
                $scope.login.error = err;
            });
        }

        function applySettings() {
            Settings.set($scope.settings).then(function (res) {
                console.log(res);
                $window.location.href = '/';
            }, function (err) {
                console.log(err);
            });
        }
    }
})();