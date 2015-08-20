(function () {
    "use strict";

    angular.module('bucket-collector').factory('ErrorsService', ErrorsService);

    ErrorsService.$inject = ['$http', '$q'];

    function ErrorsService($http, $q) {
        return {
            get: getErrors
        };

        function getErrors(bId) {
            var deferred = $q.defer();

            if (bId && angular.isString(bId)) {
                $http({
                    url: '/stats/errors/' + bId,
                    method: 'GET'
                }).then(function(result){
                    var data = result.data;
                    console.log(data);
                    if (data.success) {
                        deferred.resolve(data.errors);
                    } else {
                        deferred.reject(data.message);
                    }
                }, function(err){
                    deferred.reject(err);
                })
            } else {
                deferred.reject("No valid bucketId given");
            }

            return deferred.promise;
        }
    }
})();