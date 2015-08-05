(function () {
    "use strict";

    angular.module('bucket-collector').factory('SettingsService', SettingsService);

    SettingsService.$inject = ['ActiveBucketIdsService', 'ApiKeyService', 'IntervalService', 'TypeService', 'UrlService', '$q'];

    function SettingsService(ActiveBucketIds, ApiKey, Interval, Type, Url, $q) {
        var _deferred = $q.defer();
        var _settings = {};
        init();

        return {
            get: getSettings
        };

        function getSettings() {
            return _deferred.promise;
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

            promises.push(Url.get().then(function (res) {
                _settings.url = res;
                return res;
            }, function (err) {
                console.log(err);
                return err;
            }));

            $q.all(promises).then(function (val) {
                console.log("HERE", val);
                _deferred.resolve(_settings);
            }, function (err) {

                console.log(err);
            });
        }
    }
})();