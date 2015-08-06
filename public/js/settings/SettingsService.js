(function () {
    "use strict";

    angular.module('bucket-collector').factory('SettingsService', SettingsService);

    SettingsService.$inject = ['ActiveBucketIdsService', 'ApiKeyService', 'IntervalService', 'TypeService', 'UrlService', '$q'];

    function SettingsService(ActiveBucketIds, ApiKey, Interval, Type, Url, $q) {
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

            var promises = [];

            if (_settings.apiKey && angular.isString(_settings.apiKey)) {
                promises.push(ApiKey.set(_settings.apiKey));
            }
            if (_settings.url && angular.isString(_settings.url)) {
                promises.push(Url.set(_settings.url));
            }
            if (_settings.type && angular.isString(_settings.type)) {
                promises.push(Type.set(_settings.type));
            }
            if (_settings.interval && angular.isNumber(_settings.interval)) {
                promises.push(Interval.set(_settings.interval));
            }
            if (_settings.activeBucketIds && angular.isArray(_settings.activeBucketIds)) {
                promises.push(ActiveBucketIds.set(_settings.activeBucketIds));
            }

            $q.all(promises).then(function (res) {
                deferred.resolve(res);
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