(function() {
    "use strict";

    angular.module('bucket-collector').factory('ReactionMethodService', ReactionMethodService);

    ReactionMethodService.$inject = ['$http', '$q'];

    function ReactionMethodService($http, $q) {
        return callMethod;

        function callMethod(reactionName, methodName) {
            var deferred = $q.defer();
            if (reactionName && angular.isString(reactionName) && methodName && angular.isString(methodName)) {

                $http({
                    method: 'GET',
                    url: "/reaction/" + reactionName + "/" + methodName
                }).then(function(res) {
                    var result = res.data;

                    if (result.success) {
                        deferred.resolve(result.data);
                    } else {
                        deferred.reject(result.message);
                    }
                }, function(error) {
                    deferred.reject(error);
                });
            } else {
                deferred.reject("COULD NOT CALL REACTIONDATA");
            }

            return deferred.promise;
        }
    }
})();