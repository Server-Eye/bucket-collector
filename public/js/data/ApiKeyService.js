(function () {
    "use strict";

    angular.module('bucket-collector').factory('ApiKeyService', ApiKeyService);

    ApiKeyService.$inject = ['API_URL', '$http', '$q'];

    function ApiKeyService(API_URL, $http, $q) {
        return {
            getNew: getNewKey
        };

        function getNewKey(email, password, keyName) {
            var deferred = $q.defer();

            if (!keyName || !angular.isString(keyName) || keyName === "") {
                keyName = "bucket-collector-" + Math.random().toString(36);
            }

            $http({
                method: 'POST',
                url: API_URL.v1 + '/auth/key',
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
    }
})();