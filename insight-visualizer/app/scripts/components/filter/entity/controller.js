(function(){

  var app = angular.module("polar.components.filter.entity");
  app.controller("polar.components.filter.entity.Controller",
  [ "$scope", "polar.data.EntityCount", "$filter", "polar.util.services.StateHandler", "$q",
  function ($scope, EntityCount, $filter, StateHandler, $q){

    function init(){
      $scope.filterEntities = filterEntities;
      $scope.addEntity = addEntity;
      if(!$scope.filter.entities){
        $scope.filter.entities = [ ];
      };

      loadValidEntities();
    };

    function addEntity(sC){
      $scope.filter.entities = $scope.filter.entities.concat(sC);
    };

    function filterEntities(q){
      var deferred = $q.defer();
      deferred.resolve( $filter('filter')($scope.entities[$scope.type], q) );
      return deferred.promise;
    };

    function loadValidEntities(){
      var state = StateHandler.getInstance();
      state.initiate();
      $scope.entities = EntityCount.fetchEntites();
      state.success();
    };

    init();
  }]);

}());
