var g = angular.module('graphularSandbox', ['graphular']);

g.controller('sandbox', ['$scope', function ($scope) {
  $scope.data = [
    {label:'A', value:98},
    {label:'B', value:96},
    {label:'C', value:75},
    {label:'D', value:48}
  ];
}]);