(function () {
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
            scope.first = undefined;
            scope.data = [];
            scope.second = undefined;
            console.log(scope);

            scope.selectFirst = function (data) {
                scope.first = data;
                console.log(data);
                checkComplete();
            };

            scope.selectSecond = function (data) {
                scope.second = data;
                console.log(data);
                checkComplete();
            };

            function checkComplete() {
                if (scope.first && scope.second) {
                    return true;
                }
                return false;
            }

            scope.add = function () {
                if (checkComplete()) {
                    if (!scope.scheme.multiple) {
                        scope.data = [];
                    }
                    if (checkDuplicate(scope.first, scope.second))
                        return;

                    scope.first.disable = true;
                    scope.second.disable = true;
                    scope.data.push({
                        first: scope.first,
                        second: scope.second
                    });
                }
                updateReturnValue();
            };

            function checkDuplicate(first, second) {
                for (var i = 0; i < scope.data.length; i++) {
                    if ((scope.data[i].first[scope.scheme.data[0].dataValue] == first[scope.scheme.data[0].dataValue]) || (scope.data[i].second[scope.scheme.data[1].dataValue] == first[scope.scheme.data[1].dataValue]))
                        return true;
                }
                ;
                return false;
            }

            scope.remove = function (dataSet) {
                console.log(dataSet);
                dataSet.first.disable = false;
                dataSet.second.disable = false;
                var idx = scope.data.indexOf(dataSet);
                if (idx >= 0) {
                    scope.data.splice(idx, 1);
                }
                updateReturnValue();
            };

            function updateReturnValue() {
                scope.returnData = {};
                angular.forEach(scope.data, function (dataSet) {
                    scope.returnData[dataSet.first[scope.scheme.data[0].dataValue]] = dataSet.second[scope.scheme.data[1].dataValue];
                });
            }

            scope.getAddText = function () {
                return scope.scheme.multiple ? "add" : "select";
            };

            scope.init = function () {
                scope.data = [];
                
                angular.forEach(scope.returnData, function (value, key) {
                    var first = getFirstDataSet(key);
                    var second = getSecondDataSet(value);

                    scope.data.push({
                        first: first,
                        second: second
                    });
                });
            };

            function getFirstDataSet(value) {
                var result;

                if (scope.scheme.possibleValues) {
                    angular.forEach(scope.scheme.possibleValues[0], function (dataSet) {
                        if (dataSet[scope.scheme.data[0].dataValue] == value)
                            result = dataSet;
                    });
                }

                return result;
            }

            function getSecondDataSet(value) {
                var result;
                if (scope.scheme.possibleValues) {
                    angular.forEach(scope.scheme.possibleValues[1], function (dataSet) {
                        if (dataSet[scope.scheme.data[1].dataValue] == value)
                            result = dataSet;
                    });
                }

                return result;
            }

            scope.$watch('scheme', function (newVal, oldVal) {
                scope.init();
            }, true);
        }
    }
})();

