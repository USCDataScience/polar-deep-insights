(function(){

  var app = angular.module("polar.components.analytics.timeVariance");
  app.controller("polar.components.analytics.timeVariance.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler",
  function ($scope, Document, $FilterParser, StateHandler){

    function init(){
      $scope.state = StateHandler.getInstance();

      $scope.r = { min: 1950, max: 2020 };
      loadData();
    };

    function loadData(){
      $scope.state.initiate();
      Document.aggregateByDates($FilterParser($scope.filters)).then(function(d){
        var r = _.chain(d.aggregations.entities.entity_name.buckets)
                 .filter(function(b){ return b.key >= $scope.r.min && b.key <= $scope.r.max })
                 .sortBy(function(b){ return b.key })
                 .value();

        $scope.data = [{
          key: "Document Count",
          values: _.map(r, function(y){
            return { series: "Document Count", x: y.key , y: y.doc_count };
          })
        },{
          key: "Occurrence Count",
          values: _.map(r, function(y){
            return { series: "Occurrence Count", x: y.key , y: y.entity_count.value };
          })
        }];

        $scope.state.success();
      }, function(){
        $scope.state.fatal("Unable to load data");
      });
    };

    $scope.$on('polar.components.analytics.reloadData.Time', function(e, msg){
      loadData();
    });

    init();
  }]);

}());
