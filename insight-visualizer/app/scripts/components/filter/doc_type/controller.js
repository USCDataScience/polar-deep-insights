(function(){

  var app = angular.module("polar.components.filter.docType");
  app.controller("polar.components.filter.docType.Controller",
  [ "$scope", "polar.data.Document", "$filter", "polar.util.services.StateHandler", "$q",
  function ($scope, Document, $filter, StateHandler, $q){

    function init(){
      $scope.filterTypes = filterTypes;
      $scope.addType = addType;

      if(!$scope.filter.docTypes){
        $scope.filter.docTypes = [ ];
      };

      loadDocTypes();
    };

    function addType(sC){
      $scope.filter.docTypes = $scope.filter.docTypes.concat(sC);
    };

    function filterTypes(q){
      var deferred = $q.defer();
      if($scope.types.length > 0){
        deferred.resolve( $filter('filter')($scope.types, q) );
      } else {
        deferred.reject();
      };
      return deferred.promise;
    };

    function loadDocTypes(){
      var state = StateHandler.getInstance();
      state.initiate();
       Document.aggregateByType([ ]).then(function(r){
         $scope.types = _.chain(r.aggregations.type_count.buckets)
                         .pluck("key")
                         .map(function(e){ return { name: e} })
                         .value();
         state.success();
       }, function(){
         state.fatal();
       });
    };

    init();
  }]);

}());
