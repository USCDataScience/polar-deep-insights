(function(){

  var app = angular.module("polar.components.analytics.measurement");
  app.controller("polar.components.analytics.measurement.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler","polar.data.Measurement","$q", "polar.components.filter.$HistModal",
  function ($scope, Document, $FilterParser, StateHandler, Measurement, $q, $HistModal){

    var typeMapping = {
      "s": "time",
      "m": "length",
      "kg": "mass",
      "Hz": "frequency",
      "K": "temperature",
      "㎥": "volume",
      "W": "power",
      "m²": "area",
      "Pa": "pressure",
      "J": "energy",
      "m/s": "velocity",
      "A": "electric current",
      "F": "electric capacitance",
      "kg/m²": "surface density",
    }

    function init(){
      $scope.state = StateHandler.getInstance();
      $scope.openHistogram = openHistogram;
      loadData();
    };

    function loadData(){
      $scope.state.initiate();
      Document.aggregateByMeasurements($FilterParser($scope.filters)).then(function(d){

        $scope.data = _.chain(d.aggregations.entities.entity_name.buckets)
                       .map(function(d){
                         return {
                          unit: d.key,
                          count: d.doc_count,
                          min: d.entity_stats.min,
                          max: d.entity_stats.max,
                          avg: d.entity_stats.avg,
                          type: typeMapping[d.key]
                         }
                       })
                       .filter(function(d){
                          return !_.contains([""], d.unit) && d.avg != 0;
                       })
                       .value();

        $scope.state.success();

      }, function(){
        $scope.state.fatal();
      });
    };

    function openHistogram(u){
      $HistModal.open({ unit:u, filters: $scope.filters });
    };

    init();

    $scope.$on('polar.components.analytics.reloadData.Measurement', function(e, msg){
      loadData();
    });
  }]);

}());
