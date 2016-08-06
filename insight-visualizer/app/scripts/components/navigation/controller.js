(function(){

  var app = angular.module("polar.components.navigation");
  app.controller("polar.components.navigation.Controller",
  [ "$scope", "$location",
  function ($scope, $location) {

    function init(){
      $scope.$location = $location;
    };

    init();
  }]);

}());
