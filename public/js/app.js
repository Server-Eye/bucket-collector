(function () {
    "use strict";

    angular.module('bucket-collector', [
        'ui.bootstrap'
    ]).constant('API_URL', {
        v1: "https://api.server-eye.de/1",
        v2: "https://api.server-eye.de/2"
    });
})();