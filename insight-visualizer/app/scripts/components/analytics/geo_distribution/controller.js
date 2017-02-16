(function(){

  var app = angular.module("polar.components.analytics.geoDistribution");
  app.controller("polar.components.analytics.geoDistribution.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler",
  function ($scope, Document, $FilterParser, StateHandler){

    function init(){
      $scope.state = StateHandler.getInstance(false, true);
      loadData();
    };

    function loadData(){
      $scope.state.initiate();

      Document.aggregateByLocations($FilterParser($scope.filters), $scope.field).then(function(d){
        var totalMatchedDocs    = d.hits.total;
        var r = _.chain(d.aggregations.entities.entity_name.buckets)
                 .map(function(d){
                    return {
                      name: d.key,
                      count: d.entity_stats[$scope.fn],
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
