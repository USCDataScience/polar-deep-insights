(function(){

  var app = angular.module("polar.components.analytics");
  app.controller("polar.components.analytics.Controller",
  [ "$scope",
  function ($scope){

    function init(){
      $scope.loadData = loadData;
    };

    var loadData = function(){
      var msg;
      switch($scope.active){
        case 0:
          msg = 'polar.components.analytics.reloadData.Time';
          break;
        case 1:
          msg = 'polar.components.analytics.reloadData.Geo';
          break;
        case 2:
          msg = 'polar.components.analytics.reloadData.Concept';
          break;
        case 3:
          msg = 'polar.components.analytics.reloadData.Measurement';
          break;
        case 4:
          msg = 'polar.components.analytics.reloadData.GeoDiversity';
          break;
      };
      $scope.$broadcast(msg);
    };

    init();
  }]);

}());
