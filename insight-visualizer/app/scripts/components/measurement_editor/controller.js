(function(){

  var app = angular.module("polar.components.measurementEditor");
  app.controller("polar.components.measurementEditor.Controller",
  [ "$scope", "polar.util.services.StateHandler", "polar.data.Measurement", "polar.components.analytics.measurement.$HistModal",
  "polar.util.services.$Alert",
  function ($scope, StateHandler, Measurement, $HistModal, $Alert){
    function init(){
      $scope.save = save;
      $scope.showDistribution = showDistribution;

      $scope.groups = [ ];
      loadMeasurements();
    };

    $scope.addGroup = function(){
      $scope.groups.push($scope.groupName);
      $scope.groupName = null;
    };

    $scope.removeGroup = function(index){
      $scope.groups.splice(index, 1);
    };

    $scope.selectGroup = function(index){
      if($scope.selectedGroup != index){
        $scope.selectedGroup = index;
      } else {
        $scope.selectedGroup = null;
      };
    };

    function loadMeasurements(){
      var state = StateHandler.getInstance();
      state.initiate();
      Measurement.fetchRawMeasurements().then(function(d){
        $scope.allMeasurements = _.groupBy(d, function(m){ return m.group; });
        delete $scope.allMeasurements["undefined"];
        $scope.measurements = _.filter(d, function(m){ return !m.group; });
        $scope.groups = _.chain(d)
          .map(function(m){ return m.group })
          .filter(function(m){ return !_.isEmpty(m) })
          .unique().value();



        state.success();
      }, function(){
        state.fatal();
      });
    };

    function save(){
      var measurements = _.flatten( [ _.values($scope.allMeasurements), $scope.measurements ] );
      Measurement.persistRawMeasurements(measurements);
      $Alert.open({ message: "Curated measurements persisted"})
    };

    function showDistribution(u){
      $HistModal.open({ unit:u, filters: [ ] });
    };

    init();

    $scope.$watch("selectedGroup", function(){
      if($scope.groups[$scope.selectedGroup]){
        if(! $scope.allMeasurements[$scope.groups[$scope.selectedGroup]] ){
          $scope.allMeasurements[$scope.groups[$scope.selectedGroup]] = [ ];
        };
      };
    });
  }]);

}());
