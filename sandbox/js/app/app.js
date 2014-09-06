var g = angular.module('graphularSandbox', ['graphular']);

g.controller('sandbox', ['$scope', '$timeout', function ($scope, $timeout) {
  $scope.data = [
    {label:'A', value:(Math.floor(Math.random() * (101 - 0)) + 0)},
    {label:'B', value:(Math.floor(Math.random() * (101 - 0)) + 0)}
  ];
}]);