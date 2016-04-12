(function () {
    "use strict";

    angular.module('bucket-collector', [
        'ngSanitize',
        'ui.bootstrap',
        'ui.select'
    ]).constant('API_URL', {
        v1: "https://api.server-eye.de/1",
        v2: "https://api.server-eye.de/2"
    }).config(['$uibTooltipProvider', function($uibTooltipProvider){
        $uibTooltipProvider.options({
            placement: "right"
        });
    }]);
})();