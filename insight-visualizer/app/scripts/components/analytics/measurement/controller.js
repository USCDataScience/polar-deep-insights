(function(){

  var app = angular.module("polar.components.analytics.measurement");
  app.controller("polar.components.analytics.measurement.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler","polar.data.Measurement","$q", "polar.components.analytics.measurement.$HistModal",
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
      $scope.state = StateHandler.getInstance(false, true);
      $scope.openHistogram = openHistogram;

      loadValidMeasurements()
        .then(loadData);

    };

    function loadValidMeasurements(){
      var state = StateHandler.getInstance();
      state.initiate();
      return Measurement.fetchRawMeasurements().then(function(m){
        state.success();
        m = _.filter(m, function(x){ return x.group });
        $scope.validMeasurements = _.pluck(m, "name");
        $scope.validMeasurementsObjects = m;
      }, function(){
        state.fatal("Unable to fetch valid measurements");
      });
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
                         }
                       })
                       .filter(function(d){
                        return _.contains($scope.validMeasurements, d.unit);
                       })
                       .map(function(d){
                        d.type = $scope.validMeasurementsObjects[  _.indexOf($scope.validMeasurements, d.unit) ].group;
                        return d;
                       })
                       .value();

        $scope.types = _.chain($scope.data).pluck("type").unique().value();
        $scope.filteredType = $scope.types[0]
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
