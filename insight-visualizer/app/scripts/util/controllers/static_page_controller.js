angular.module("polar.util.controllers")

.controller("polar.util.controllers.StaticPageController",["$scope", "$routeParams",
  function($scope, $routeParams){

    function init(){
      $scope.params = $routeParams;
    };

    init();

  }
]);
