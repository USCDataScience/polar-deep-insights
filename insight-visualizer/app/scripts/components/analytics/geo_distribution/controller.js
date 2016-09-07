(function(){

  var app = angular.module("polar.components.analytics.geoDistribution");
  app.controller("polar.components.analytics.geoDistribution.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler","polar.data.EntityCount",
  function ($scope, Document, $FilterParser, StateHandler, EntityCount){

    function init(){
      $scope.state = StateHandler.getInstance(false, true);
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

      Document.aggregateByLocations($FilterParser($scope.filters), $scope.field).then(function(d){
        $scope.entitiyCount = EntityCount.data;
        var totalMatchedDocs    = d.hits.total;
        var r = _.chain(d.aggregations.entities.entity_name.buckets)
                 .map(function(d){
                    return {
                      name: d.key,
                      count: parseValue(totalMatchedDocs, d),
                      country: 'USA',
                      fillKey: 'USA',
                      latitude: d.lat.value,
                      longitude: d.lon.value
                    }
                 })
                 .sortBy(function(d){ return -d.count; })
                 .value();
        $scope.state.success();

        r = r.slice(0, $scope.slider.value);

        var maxC = _.max(r, function(x){ return x.count }).count;

        var subS = _.map(r, function(d){
          d.radius = (d.count / maxC) * ($scope.slider.scale || 100);
          return d;
        });

        $scope.loadMap(subS);
      }, function(){
        $scope.state.fatal();
      });
    };

    $scope.$on('polar.components.analytics.reloadData.Geo', function(e){
      loadData();
    });

    init();
  }]);

}());
