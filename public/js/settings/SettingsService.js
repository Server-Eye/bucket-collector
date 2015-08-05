(function () {
    "use strict";

    angular.module('bucket-collector').factory('SettingsService', SettingsService);

    SettingsService.$inject = ['ApiKeyService', '$http', '$q'];

    function SettingsService(ApiKey, $http, $q) {
        var _deferred = $q.defer();
        var _settings = {};
        init();
        
        return {
            get: getSettings
        };
        
        function getSettings(){
            return _deferred.promise;
        }
        
        function init(){
            ApiKey.get().then(function(key){
                _settings.apiKey = key;
                _deferred.resolve(_settings);
            });
        }
    }
})();