(function () {
    "use strict";

    angular.module('bucket-collector').factory('UrlService', UrlService);

    UrlService.$inject = ['$http', '$q'];

    function UrlService($http, $q) {
        return {
            get: getUrl,
            set: setUrl
        };

        function getUrl() {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: '/settings/getUrl'
            }).then(function (result) {
                var data = result.data;

                if (data.success) {
                    deferred.resolve(data.url);
                } else {
                    deferred.reject(data.message);
                }
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function setUrl(url) {
            var deferred = $q.defer();

            if (angular.isString(url)) {
                $http({
                    method: 'GET',
                    url: '/settings/setUrl',
                    params: {
                        url: url
                    }
                }).then(function (result) {
                    var data = result.data;

                    if (data.success) {
                        deferred.resolve(url);
                    } else {
                        deferred.reject(data.message);
                    }
                }, function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.reject("Given url is not a string");
            }

            return deferred.promise;
        }
    }
})();