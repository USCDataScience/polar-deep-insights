(function(){

  var app = angular.module("polar.components.filter.concept");
  app.controller("polar.components.filter.concept.SearchController",
  [ "$scope",  "polar.data.ConceptFactory", "$q", "$filter", function ($scope, ConceptFactory, $q, $filter){

    function init(){
      $scope.factory = ConceptFactory.getInstance();
      $scope.conceptNames = $scope.factory.getConceptNames();
    };

    $scope.filterConcepts = function(query){
      var deferred = $q.defer();
      deferred.resolve( $filter('filter')($scope.conceptNames, query) );
      return deferred.promise;
    };

    init();
  }]);

}());
