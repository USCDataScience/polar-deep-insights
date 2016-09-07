(function(){

  var app = angular.module("polar.components.conceptEditor.export");
  app.controller("polar.components.conceptEditor.export.Controller",["$scope", function($scope){
    function init(){
      $scope.entityString = $scope.factory.getConceptNames().join('\n');
    };

    init();
  }]);

}());




