(function () {
    "use strict";

    angular.module('bucket-collector').factory('ApiKeyService', ApiKeyService);

    ApiKeyService.$inject = ['API_URL', '$http', '$q'];

    function ApiKeyService(API_URL, $http, $q) {
        var _apiKey;

        return {
            get: getKey,
            set: setKey,
            getNew: getNewKey
        };

        function getKey() {
            var deferred = $q.defer();

            if (_apiKey) {
                deferred.resolve(_apiKey);
            } else {
                getOldKey().then(function (key) {
                    deferred.resolve(key);
                }, function (err) {
                    deferred.reject(err);
                });
            }

            return deferred.promise;
        }

        function getOldKey() {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/settings/getApiKey'
            }).then(function (result) {
                var data = result.data;

                if (data.success) {
                    setKey(data.apiKey);
                    deferred.resolve(data.apiKey);
                } else {
                    deferred.reject(data.message);
                }
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function getNewKey(email, password) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: API_URL + '/auth/key',
                data: {
                    email: email,
                    password: password,
                    name: 'bucket-collector'
                }
            }).then(function (result) {
                var data = result.data;
                if (data.success) {
                    setKey(data.apiKey).then(function (key) {
                        deferred.resolve(key);
                    }, function (err) {
                        deferred.reject(err);
                    });
                } else {
                    deferred.reject(data.message);
                }
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function setKey(key) {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/settings/setApiKey',
                params: {
                    apiKey: key
                }
            }).then(function (result) {
                var data = result.data;

                if (data.success) {
                    _apiKey = key;
                    deferred.resolve(key);
                } else {
                    deferred.reject(data.message);
                }
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
    }
})();