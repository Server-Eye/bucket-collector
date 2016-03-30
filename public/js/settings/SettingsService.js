(function () {
    "use strict";

    angular.module('bucket-collector').factory('SettingsService', SettingsService);

    SettingsService.$inject = ['$q', '$http'];

    function SettingsService($q, $http) {
        var _settings = {};
        
        return {
            get: getSettings,
            getNewApiKey: getNewApiKey,
            set: setSettings
        };

        function setSettings(settings) {
            var deferred = $q.defer();

            _settings = settings;

            $http({
                method: 'POST',
                url: '/settings/setSettings',
                data: settings
            }).then(function (result) {
                var data = result.data;

                if (data.success) {
                    deferred.resolve(settings);
                } else {
                    deferred.reject(data.message);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function getSettings() {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/settings/getSettings'
            }).then(function (result) {
                var data = result.data;

                if (data.success) {
                    deferred.resolve(data.settings);
                } else {
                    deferred.reject(data.message);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function getNewApiKey(email, password, name) {
            return ApiKey.getNew(email, password, name);
        }

        function init() {
            
        }
    }
})();