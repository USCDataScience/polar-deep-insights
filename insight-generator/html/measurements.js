angular.module("measurement.eval", ['ngAnimate', 'ngSanitize', 'ui.bootstrap'])
.controller('HomeCtrl', function ($scope, $http){

  function computeOverlap(gb, pt){

    $scope.grobid    = _.map(gb, function(d){ return { unit: d.rawUnit.name, value: d.parsedValue } });
    $scope.parseTree = _.map(pt, function(d){ return { unit: d.unit, value: d.value } });

    $scope.grobid    = _.map($scope.grobid, function(e){
      var common = _.find($scope.parseTree, function(d){
        return ((e.unit == d.unit) && (e.value == d.value));
      });

      if(common){
        e.common = true;
      };

      return e;
    });
    $scope.grobid    = _.sortBy($scope.grobid, function(e){ return e.common });

    $scope.common = _.filter($scope.grobid, function(e){ return e.common }).length;
    $scope.total = ( $scope.grobid.length - $scope.common) + ( $scope.parseTree.length - $scope.common) + $scope.common;

    $scope.parseTree    = _.map($scope.parseTree, function(e){
      var common = _.find($scope.grobid, function(d){
        return ((e.unit == d.unit) && (e.value == d.value));
      });
      if(common){
        e.common = true;
      };
      return e;
    });
    $scope.parseTree    = _.sortBy($scope.parseTree, function(e){ return e.common })
  };

  $http({ url: 'measurements.json' }).then(function(d){
    $scope.dataLoaded = true;
    $scope.data = d.data;
    computeOverlap($scope.data['grobid-measurements'], $scope.data['parse-tree-measurements']);
  }, function(r){
    $scope.dataLoaded = false;
  })
});
