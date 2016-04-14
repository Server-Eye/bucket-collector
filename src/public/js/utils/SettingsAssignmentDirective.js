(function() {
    "use strict";

    angular.module('bucket-collector').directive('settingsAssignment', settingsAssignment);

    function settingsAssignment() {
        return {
            restrict: 'E',
            scope: {
                scheme: '=',
                returnData: '='
            },
            link: link,
            templateUrl: '/partials/settingsAssignment'
        };

        function link(scope, element, attrs) {
            scope.data = [];
            scope.input = {
                first: undefined,
                second: undefined
            };
            console.log(scope);

            scope.selectFirst = function(data) {
                scope.input.first = data;
                console.log(data);
                checkComplete();
            };

            scope.selectSecond = function(data) {
                scope.input.second = data;
                console.log(data);
                checkComplete();
            };

            function checkComplete() {
                if (scope.input.first && scope.input.second) {
                    return true;
                }
                return false;
            }

            scope.add = function() {
                if (checkComplete()) {
                    if (!scope.scheme.multiple) {
                        scope.data = [];
                    }
                    if (checkDuplicate(scope.input.first, scope.input.second))
                        return;
                    if (scope.scheme.data[0].type == 'select')
                        scope.input.first.disable = true;
                    if (scope.scheme.data[1].type == 'select')
                        scope.input.second.disable = true;
                    scope.data.push({
                        first: scope.input.first,
                        second: scope.input.second
                    });
                }

                console.log(scope.data);
                updateReturnValue();
            };

            function checkDuplicate(first, second) {
                for (var i = 0; i < scope.data.length; i++) {
                    if (scope.scheme.data[0].type == 'select') {
                        if (scope.data[i].first[scope.scheme.data[0].dataValue] == first[scope.scheme.data[0].dataValue])
                            return true;
                    } else {
                        if (scope.data[i].first == first)
                            return true;
                    }
                    if (scope.scheme.data[1].type == 'select') {
                        if (scope.data[i].second[scope.scheme.data[1].dataValue] == first[scope.scheme.data[1].dataValue])
                            return true;
                    } else {
                        if (scope.data[i].second == second)
                            return true;
                    }
                }
                return false;
            }

            scope.remove = function(dataSet) {
                console.log(dataSet);
                if (scope.scheme.data[0].type == 'select')
                    dataSet.first.disable = false;
                if (scope.scheme.data[1].type == 'select')
                    dataSet.second.disable = false;
                var idx = scope.data.indexOf(dataSet);
                if (idx >= 0) {
                    scope.data.splice(idx, 1);
                }
                updateReturnValue();
            };

            function updateReturnValue() {
                scope.returnData = {};
                angular.forEach(scope.data, function(dataSet) {
                    if (scope.scheme.data[0].type == 'select') {
                        scope.returnData[dataSet.first[scope.scheme.data[0].dataValue]] = (scope.scheme.data[1].type == 'select') ? dataSet.second[scope.scheme.data[1].dataValue] : dataSet.second;
                    } else {
                        scope.returnData[dataSet.first] = (scope.scheme.data[1].type == 'select') ? dataSet.second[scope.scheme.data[1].dataValue] : dataSet.second;
                    }
                });

                console.log(scope.returnData);
            }

            scope.getAddText = function() {
                return scope.scheme.multiple ? "add" : "select";
            };

            scope.init = function() {
                scope.data = [];

                angular.forEach(scope.returnData, function(value, key) {
                    var first, second;
                    if (scope.scheme.data[0].type == 'select') {
                        first = getFirstDataSet(key);
                    } else {
                        first = key;
                    }

                    if (scope.scheme.data[1].type == 'select') {

                        second = getSecondDataSet(value);
                    } else {
                        second = value;
                    }

                    scope.data.push({
                        first: first,
                        second: second
                    });
                });
            };

            function getFirstDataSet(value) {
                var result;

                if (scope.scheme.possibleValues) {
                    angular.forEach(scope.scheme.possibleValues[0], function(dataSet) {
                        if (dataSet[scope.scheme.data[0].dataValue] == value)
                            result = dataSet;
                    });
                }

                return result;
            }

            function getSecondDataSet(value) {
                var result;
                if (scope.scheme.possibleValues) {
                    angular.forEach(scope.scheme.possibleValues[1], function(dataSet) {
                        if (dataSet[scope.scheme.data[1].dataValue] == value)
                            result = dataSet;
                    });
                }

                return result;
            }

            scope.$watch('scheme', function(newVal, oldVal) {
                scope.init();
            }, true);

            scope.getErrorClass = function(error) {
                return error ? 'has-error' : '';
            };
        }
    }
})();