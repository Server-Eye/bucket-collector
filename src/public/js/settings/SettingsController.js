(function() {
    "use strict";

    angular.module('bucket-collector').controller('SettingsController', SettingsController);

    SettingsController.$inject = ['SettingsService', 'BucketsService', '$window', '$scope'];

    function SettingsController(Settings, Buckets, $window, $scope) {
        $scope.loaded = false;
        $scope.settings = {};

        Settings.get().then(function(settings) {
            $scope.settings = settings;
        });
        $scope.login = {
            email: "",
            password: "",
            name: "",
            error: ""
        };
        $scope.resetKey = resetKey;
        $scope.newKey = newKey;
        $scope.applySettings = applySettings;
        $scope.apiKeyAvailable = false;

        $scope.$watch("buckets", function(newVal, oldVal) {
            $scope.settings.activeBucketIds = [];
            angular.forEach(newVal, function(bucket) {
                if (bucket.active) {
                    $scope.settings.activeBucketIds.push(bucket.bId);
                }
            });
        }, true);

        $scope.$watch("settings.maxRetries", function(newVal, oldVal) {
            if (!angular.isNumber(newVal)) {
                $scope.settings.maxRetries = 1;
            } else {
                $scope.settings.maxRetries = newVal;
            }
        });

        $scope.$watch("settings.interval", function(newVal, oldVal) {
            if (!angular.isNumber(newVal)) {
                $scope.settings.interval = 1;
            } else {
                $scope.settings.interval = newVal;
            }
        });

        function init() {
            Settings.get().then(function(settings) {
                $scope.settings = settings;
                if (settings.apiKey) {
                    $scope.apiKeyAvailable = true;
                } else {
                    $scope.apiKeyAvailable = false;
                }
                $scope.loaded = true;
            }).then(function() {
                if ($scope.settings.apiKey) {
                    Buckets.getAll($scope.settings.apiKey).then(function(buckets) {
                        $scope.buckets = buckets;
                    });
                }
            });
        }

        init();

        function resetKey() {
            $scope.apiKeyAvailable = !$scope.apiKeyAvailable;
        }

        function newKey() {
            console.log($scope.login.email, $scope.login.password);
            Settings.getNewApiKey($scope.login.email, $scope.login.password, $scope.login.name).then(function(key) {
                console.log("Got new apiKey: '" + key + "'");
                $scope.settings.apiKey = key;
                $scope.login.error = "";
                init();
            }, function(err) {
                console.log(err);
                $scope.login.error = err;
            });
        }

        function applySettings() {
            Settings.set($scope.settings).then(function(res) {
                $window.location.href = '/settings/reaction';
            }, function(err) {
                console.log(err);
            });
        }
    }
})();