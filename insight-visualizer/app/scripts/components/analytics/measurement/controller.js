(function(){

  var app = angular.module("polar.components.analytics.measurement");
  app.controller("polar.components.analytics.measurement.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler","polar.data.Measurement","$q", "polar.components.analytics.measurement.$HistModal",
  function ($scope, Document, $FilterParser, StateHandler, Measurement, $q, $HistModal){

    var typeMapping = {
      "s": "time",
      "m": "distance",
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
      "H": "electrical inductance",
      "C": "electric charge",
      "N": "force",
      "S": "electric conductance",
      "Ω": "resistance",     
    }

    function init(){
      $scope.state = StateHandler.getInstance(false, true);
      $scope.openHistogram = openHistogram;

      loadValidMeasurements()
        .then(loadData);

      $scope.mType = "normal";
    };


    function loadValidMeasurements(){
      var state = StateHandler.getInstance();
      state.initiate();

      if($scope.mType == 'raw'){
        return Measurement.fetchRawMeasurements().then(function(m){
          state.success();
          m = _.filter(m, function(x){ return x.group });
          $scope.validMeasurements = _.pluck(m, "name");
          $scope.validMeasurementsObjects = m;
        }, function(){
          state.fatal("Unable to fetch valid measurements");
        });
      } else {
         var deferred = $q.defer();
         deferred.resolve();
         state.success();
         $scope.validMeasurements = _.keys(typeMapping);
         $scope.validMeasurementsObjects = _.map(typeMapping, function(v,k){
            return { name: k, group: v }
         });
         return deferred.promise;
      }

    };

    function loadData(){
      $scope.state.initiate();
      Document.aggregateByMeasurements($FilterParser($scope.filters), $scope.mType).then(function(d){
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

        $scope.types = _.values(typeMapping);
        // _.chain($scope.data).pluck("type").unique().value();
        $scope.filteredType = $scope.types[0]
        $scope.state.success();

      }, function(){
        $scope.state.fatal();
      });
    };

    function openHistogram(u){
      $HistModal.open({ unit:u, filters: $scope.filters, type: $scope.mType });
    };

    init();

    $scope.$on('polar.components.analytics.reloadData.Measurement', function(e, msg){
      loadValidMeasurements().then(loadData);
    });
  }]);

}());
