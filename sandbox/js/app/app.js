var g = angular.module('graphularSandbox', ['graphular']);

g.controller('sandbox', ['$scope', function ($scope) {
  $scope.data = [
    {label:'Greg',  value:98},
    {label:'Ari',   value:96},
    {label:'Q',     value:75},
    {label:'Loser', value:48}
  ];
}]);