(function(){

  var app = angular.module("polar.components.addFilter");
  app.controller("polar.components.addFilter.Controller",
  [ "$scope", "polar.components.addFilter.$TypeModal",
  function ($scope, $TypeModal) {

    function init(){
      $scope.addFilter = addFilter;
    };

    function addFilter(){
      $TypeModal.open().then(function(d){
        $scope.filters.push(d);
      })
    };

    init();
  }]);

}());
