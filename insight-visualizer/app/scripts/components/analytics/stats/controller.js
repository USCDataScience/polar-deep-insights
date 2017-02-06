(function(){

  var app = angular.module("polar.components.analytics.stats");

  app.controller("polar.components.analytics.stats.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler",
  function ($scope, Document, $FilterParser, StateHandler){
    function init(){
      $scope.keys = ["entities", "dates", "time", "places", "organizations", "percentages", "money", "people", "locations"];
      $scope.loadData = loadData;
      loadData();
    };

    function loadData(){
      var state = StateHandler.getInstance(false, true)
      state.initiate();
      Document.aggregateStats([ ])
      .then(function(d){
        $scope.totalDocCount = d.hits.total;
        return Document.aggregateStats($FilterParser($scope.filters))
      })
      .then(function(d){
        $scope.docCount = d.hits.total;
        $scope.results  = d.aggregations;

        $scope.data = [
          {
            key: "Filtered",
            y: $scope.docCount
          },
          {
            key: "Rest",
            y: ( $scope.totalDocCount - $scope.docCount )
          }
        ];
        state.success();
      }, function(){
        state.fatal();
      });
      loadTypeData();
    };

    function loadTypeData(){
      var state = StateHandler.getInstance(false, true)
      state.initiate();
      Document.aggregateByType($FilterParser($scope.filters))
      .then(function(d){
        $scope.typeData = d.aggregations.type_count.buckets;
        state.success();
      }, function(){
        state.fatal();
      });
    };

    init();

    $scope.$on('polar.components.analytics.reloadData.Stats', function(e){
      loadData();
    });
  }]);
}());
