(function(){

  var app = angular.module("polar.components.filter.geo");
  app.controller("polar.components.filter.geo.Controller",
  [ "$scope", "leafletDrawEvents", function ($scope, leafletDrawEvents){


    var drawnItems = new L.FeatureGroup();
    var drawEvents = leafletDrawEvents.getAvailableEvents();
    drawEvents.forEach(function(eventName){
        $scope.$on('leafletDirectiveDraw.' + eventName, function(e, payload) {
          var leafletEvent, leafletObject, model, modelName;
          leafletEvent = payload.leafletEvent, leafletObject = payload.leafletObject, model = payload.model,
          modelName = payload.modelName;
          handle[eventName.replace('draw:','')](e,leafletEvent, leafletObject, model, modelName);
        });
    });

    var createRegion = function(coords, layer){
      var key = $scope.filter.regions.length + 1,
          regionName = "Region-" + key,
          region = {
            name: regionName,
            coords: coords,
            layer: layer
          };

      $scope.filter.regions.push(region);
    };

    var removeRegion = function(index){
      drawnItems.removeLayer($scope.filter.regions[index].layer);
      $scope.filter.regions.splice(index, 1);
    };

    var handle = {
      created: function(e, leafletEvent, leafletObject, model, modelName) {
        drawnItems.addLayer(leafletEvent.layer);
        createRegion(leafletEvent.layer._latlngs, leafletEvent.layer);
      },
      edited: function(arg) { },
      deleted: function(arg) { },
      drawstart: function(arg) {},
      drawstop: function(arg) {},
      editstart: function(arg) {},
      editstop: function(arg) {},
      deletestart: function(arg) {},
      deletestop: function(arg) {}
    };

    function init(){
      if(!$scope.filter.regions){
        $scope.filter.regions = [ ];
      };

      // TO DO FIX THIS
      // _.each($scope.filter.regions, function(r){
      //   drawnItems.addLayer(r.layer);
      // });

      $scope.data = [ ];
      $scope.map =  {
        center: {
          lat: 0,
          lng: 0,
          zoom: 2
        },
        drawOptions: {
          position: "bottomright",
          draw: {
            polyline: false,
            polygon: false,
            circle:false,
            marker: false
          },
          edit: {
            featureGroup: drawnItems,
            remove: false,
            edit: false,
          }
        }
      };
      $scope.removeRegion = removeRegion;
    };

    init();

  }]);

}());
