(function(){
  var app = angular.module("polar.components.analytics.measurement");
  app.controller("polar.components.analytics.measurement.HistController", [ "$scope", "polar.data.Measurement", "polar.util.services.StateHandler",
    function($scope, Measurement, StateHandler){
      function init(){
        $scope.state = StateHandler.getInstance();

        $scope.state.initiate();
        Measurement.fetchDistribution($scope.unit).then(function(r){
          $scope.state.success();
          $scope.data = [{
            key: $scope.unit,
            values: parseResp(r[0]),
          }];

          console.log($scope.data)
        }, function(){
          $scope.state.fatal();
        });
      };

      function parseResp(r){
        return _.chain(r.hits.hits)
         .map(function(d){ return d.inner_hits['quantities.normalizedUnit'].hits.hits })
         .flatten()
         .pluck("_source")
         .map(function(d){
            return {
              x: parseInt(Math.random() * 25),
              y: d.normalizedQuantity,
              size: 100,
              shape: 'cross'
            };
         })
         .value();
      };

      init();
    }
  ]);
}());
