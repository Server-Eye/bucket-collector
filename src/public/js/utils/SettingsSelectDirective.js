(function() {
    "use strict";

    angular.module('bucket-collector').directive('settingsSelect', settingsSelect);

    function settingsSelect() {
        return {
            restrict: 'E',
            scope: {
                scheme: '=',
                returnData: '='
            },
            link: link,
            templateUrl: '/partials/settingsSelect'
        };

        function link(scope, element, attrs) {
            scope.data = scope.scheme.multiple ? [] : undefined;

            scope.select = function(data) {
                scope.selected = data;
            };

            scope.add = function() {
                if (scope.scheme.multiple) {
                    if (scope.data.indexOf(scope.selected) <= -1) {
                        scope.data.push(scope.selected);
                    }
                } else {
                    scope.data = scope.selected;
                }
                updateReturnValue();
            };

            scope.remove = function(data) {
                if (scope.scheme.multiple) {
                    var idx = scope.data.indexOf(data);

                    if (idx >= 0) {
                        scope.data.splice(idx, 1);
                    }
                } else {
                    scope.data = undefined;
                }
                updateReturnValue();
            };

            scope.getAddText = function() {
                return scope.scheme.multiple ? "add" : "select";
            };

            scope.init = function() {
                if (scope.scheme.multiple) {
                    angular.forEach(scope.returnData, function(dataSet) {
                        var fullData = getFullDataSet(dataSet);
                        if (fullData && (scope.data.indexOf(fullData) < 0)) {
                            scope.data.push(fullData);
                        }
                    });
                } else {
                    scope.data = getFullDataSet(scope.returnData);
                    console.log("d", scope.data);
                }
            };

            function getFullDataSet(data) {
                var result;
                angular.forEach(scope.scheme.possibleValues, function(value) {
                    if (value[scope.scheme.data.dataValue] == data) {
                        result = value;
                    }
                });
                return result;
            }

            function updateReturnValue() {
                if (scope.scheme.multiple) {
                    scope.returnData = [];

                    angular.forEach(scope.data, function(dataSet) {
                        var value = dataSet[scope.scheme.data.dataValue];
                        if (value) {
                            scope.returnData.push(value);
                        }
                    });
                } else {
                    if (scope.data) {
                        scope.returnData = scope.data[scope.scheme.data.dataValue];
                    } else {
                        scope.returnData = undefined;
                    }
                }
            }

            scope.$watch('scheme', function(newVal, oldVal) {
                scope.init();
            }, true);

            scope.getErrorClass = function(error) {
                return error ? 'has-error' : '';
            };

            scope.init();
        }
    }
})();