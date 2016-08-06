(function(){

  var app = angular.module("polar.components.conceptEditor.concept");
  app.controller("polar.components.conceptEditor.concept.Controller",["$scope", function($scope){
    function init(){
      if(!$scope.concept){
        $scope.concept = { };
        $scope.concept.alias = [ ];
      }

      $scope.concept.isValid = function(){
        return (this.name && this.type );
      };
    };

    init();
  }]);

}());




