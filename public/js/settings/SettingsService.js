(function () {
    "use strict";

    angular.module('bucket-collector').factory('SettingsService', SettingsService);

    SettingsService.$inject = ['ActiveBucketIdsService', 'ApiKeyService','AvailableTypesService' ,'IntervalService', 'TypeService', 'MaxRetriesService', '$q', '$http'];

    function SettingsService(ActiveBucketIds, ApiKey, AvailableTypes, Interval, Type, MaxRetries, $q, $http) {
        var _deferred = $q.defer();
        var _settings = {};
        init();

        return {
            get: getSettings,
            getNewApiKey: getNewApiKey,
            set: setSettings
        };

        function setSettings(settings) {
            var deferred = $q.defer();

            _settings = settings;

            $http({
                method: 'GET',
                url: '/settings/setSettings',
                params: settings
            }).then(function (result) {
                var data = result.data;

                if (data.success) {
                    deferred.resolve(settings);
                } else {
                    deferred.reject(data.message);
                }
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function getSettings() {
            return _deferred.promise;
        }

        function getNewApiKey(email, password, name) {
            return ApiKey.getNew(email, password, name);
        }

        function init() {
            var promises = [];

            promises.push(ApiKey.get().then(function (res) {
                _settings.apiKey = res;
                return res;
            }, function (err) {
                console.log(err);
                return err;
            }));

            promises.push(ActiveBucketIds.get().then(function (res) {
                _settings.activeBucketIds = res;
                return res;
            }, function (err) {
                console.log(err);
                return err;
            }));
            
            promises.push(AvailableTypes.get().then(function (res) {
                _settings.availableTypes = res;
                return res;
            }, function (err) {
                console.log(err);
                return err;
            }));

            promises.push(Interval.get().then(function (res) {
                _settings.interval = res;
                return res;
            }, function (err) {
                console.log(err);
                return err;
            }));

            promises.push(Type.get().then(function (res) {
                _settings.type = res;
                return res;
            }, function (err) {
                console.log(err);
                return err;
            }));
            
            promises.push(MaxRetries.get().then(function (res) {
                _settings.maxRetries = res;
                return res;
            }, function (err) {
                console.log(err);
                return err;
            }));

            $q.all(promises).then(function (val) {
                _deferred.resolve(_settings);
            }, function (err) {
                console.log(err);
            });
        }
    }
})();