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

        function getNewKey(email, password, keyName) {
            var deferred = $q.defer();

            if(!keyName || !angular.isString(keyName) || keyName===""){
                keyName = "bucket-collector-" + Math.random().toString(36);
            }

            $http({
                method: 'POST',
                url: API_URL + '/auth/key',
                data: {
                    email: email,
                    password: password,
                    name: keyName
                }
            }).then(function (result) {
                var data = result.data;
                if (data.success) {
                    var key = data.data.apiKey;
                    setKey(key).then(function (key) {
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
            console.log(key);

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