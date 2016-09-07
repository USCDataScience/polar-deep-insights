(function(){

  var app = angular.module("polar.components.filter.measurement");
  app.controller("polar.components.filter.measurement.Controller",
  [ "$scope", "polar.data.Measurement", "$filter", "polar.util.services.StateHandler", "$q", "polar.components.analytics.measurement.$HistModal",
  function ($scope, Measurement, $filter, StateHandler, $q, $HistModal){

    function init(){
      $scope.openHist = openHist;
      $scope.filterMeasurements = filterMeasurements;
      $scope.addFilter = addFilter;
      $scope.measurements = [ ];

      if(!$scope.filter.measurements){
        $scope.filter.measurements = [ ];
      };

      loadValidMeasurements();
    };

    function addFilter(sC){
      $scope.filter.measurements = $scope.filter.measurements.concat(sC);
    };

    function filterMeasurements(q){
      var deferred = $q.defer();
      deferred.resolve( $filter('filter')($scope.measurements, q) );
      return deferred.promise;
    };

    function loadValidMeasurements(){
      var state = StateHandler.getInstance();
      state.initiate();
      return Measurement.fetchRawMeasurements().then(function(m){
        m = _.filter(m, function(x){ return x.group });
        $scope.measurements = m;
        state.success();
      }, function(){
        state.fatal("Unable to fetch valid measurements");
      });
    };

    function openHist(u){
      $HistModal.open({ unit:u, filters: $scope.filters });
    };


    init();
  }]);

}());
