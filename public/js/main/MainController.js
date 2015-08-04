(function () {
    "use strict";

    angular.module('bucket-collector').controller('MainController', MainController);

    MainController.$inject = ['ApiKeyService', '$scope'];

    function MainController(ApiKey, $scope) {
        $scope.test = "testbinding";

        ApiKey.get().then(function (key) {
            console.log("SUCCESS:", key);
        }, function (err) {
            console.log("ERR:", err);
        });
    }
})();