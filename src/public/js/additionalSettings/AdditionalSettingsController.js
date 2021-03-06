(function() {
    "use strict";

    angular.module('bucket-collector').controller('AdditionalSettingsController', AdditionalSettingsController);

    AdditionalSettingsController.$inject = ['$scope', '$location', '$window', '$q', 'SchemeService', 'SchemeDataService', 'ReactionDataService'];

    function AdditionalSettingsController($scope, $location, $window, $q, Scheme, SchemeData, ReactionData) {
        $scope.reactionName = $location.absUrl().split('/').pop();
        $scope.helpURL = "";
        $scope.loaded = false;
        $scope.schemeDefined = true;
        $scope.applySettings = applySettings;


        function init() {
            $scope.loaded = false;
            Scheme($scope.reactionName).then(function(res) {
                $scope.schemeDefined = true;
                $scope.schemes = res.dataSets;
                $scope.helpURL = res.helpURL;
                $scope.data = {};
                angular.forEach($scope.schemes, function(scheme) {
                    $scope.data[scheme.name] = undefined;
                });
                return ReactionData.get($scope.reactionName);
            }, function(err) {
                $scope.schemeDefined = false;
                $scope.schemeError = err;
                return;
            }).then(function(res) {
                angular.forEach(res, function(val, key) {
                    $scope.data[key] = val;
                });
                console.log($scope.data);
            }).then(function() {
                angular.forEach($scope.schemes, function(scheme) {
                    if (scheme.data) {
                        if (angular.isArray(scheme.data)) {
                            scheme.possibleValues = [];
                            scheme.error = [];
                            angular.forEach(scheme.data, function(value, key) {
                                SchemeData($scope.reactionName, value).then(function(data) {
                                    scheme.possibleValues[key] = data;
                                }, function(error) {
                                    console.log(key);
                                    console.log('ERROR');
                                    console.log(error);
                                    scheme.possibleValues[key] = [];
                                    scheme.error[key] = error;
                                });
                            });
                        } else {
                            SchemeData($scope.reactionName, scheme.data).then(function(data) {
                                scheme.possibleValues = data;
                            }, function(error) {
                                scheme.possibleValues = [];
                                scheme.error = error;
                            });
                        }
                    }
                });

                $scope.loaded = true;
            });
        }

        function checkRequired() {
            var allCorrect = true;

            angular.forEach($scope.schemes, function(scheme) {
                if (scheme.required)
                    allCorrect = ($scope.data[scheme.name] && allCorrect) ? true : false;
            });

            return allCorrect;
        }

        function applySettings() {
            console.log($scope.data);

            ReactionData.set($scope.reactionName, $scope.data).then(function() {
                if (checkRequired()) {
                    $window.location.href = '/';
                } else {
                    $window.location.reload();
                }
            });
        }

        init();
    }
})();