(function () {
    "use strict";

    angular.module('bucket-collector').directive('settings', settingsDirective);
    
    settingsDirective.$inject = ['SettingsService'];
    
    function settingsDirective(Settings) {
        return {
            restrict: 'E',
            link: link,
            scope: {},
            templateUrl: 'partials/settings'
        };
        
        function link(scope, element, attrs) {
            Settings.get().then(function(settings){
                scope.settings = settings;
            });
        }
    }
})();