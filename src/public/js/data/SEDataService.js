(function () {
    "use strict";

    angular.module('bucket-collector').factory('SEDataService', SEDataService);

    SEDataService.$inject = ['API_URL', '$http', '$q', 'SettingsService'];

    function SEDataService(API_URL, $http, $q, Settings) {
        return {
            getCustomers: getCustomers
        };

        function getCustomers() {
            var deferred = $q.defer();

            Settings.get().then(function (settings) {
                if (!settings.apiKey || !angular.isString(settings.apiKey) || settings.apiKey === "") {
                    deferred.reject('NO VALID APIKEY');
                } else {

                    $http({
                        method: 'GET',
                        url: API_URL.v2 + '/customer',
                        params: {
                            apiKey: settings.apiKey
                        }
                    }).then(function (result) {
                        var data = result.data;
                        if (data) {
                            console.log(data);
                            if(data.message){
                                deferred.reject(data.message);
                            } else {
                                deferred.resolve(data);
                            }
                        } else {
                            deferred.reject("NO DATA RECEIVED");
                        }
                    }, function (error) {
                        if(error.data && error.data.message){
                            deferred.reject(error.data.message);
                        } else {
                            deferred.reject(error.data);
                        }
                    });
                }
            });


            return deferred.promise;
        }

    }
})();