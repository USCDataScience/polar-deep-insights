(function(){

  var app = angular.module("polar.components.analytics.timeVariance");
  app.controller("polar.components.analytics.timeVariance.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler",
  function ($scope, Document, $FilterParser, StateHandler){

    function init(){
      $scope.state = StateHandler.getInstance(false, true);

      $scope.r = { min: 1950, max: 2020 };
      loadData();
    };

    function loadData(){
      $scope.state.initiate();

      function parseValue(totalMatchedDocs, y){
        if($scope.field == 'tf-idf'){
          var idf = Math.log(1 + totalMatchedDocs / (y.doc_count) );
          var tf = 1 + Math.log( y.entity_stats[$scope.fn] );
          return tf * idf;
        } else {
          return y.entity_stats[$scope.fn];
        }
      };

      Document.aggregateByDates($FilterParser($scope.filters), $scope.field).then(function(d){
        var totalMatchedDocs    = d.hits.total;
        var r = _.chain(d.aggregations.entities.entity_name.buckets)
                 .filter(function(b){ return b.key >= $scope.r.min && b.key <= $scope.r.max })
                 .sortBy(function(b){ return b.key })
                 .value();

        $scope.data = [{
          key: "Computed",
          values: _.map(r, function(y){
            return { series: "Computed", x: y.key , y: parseValue(totalMatchedDocs, y) };
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
