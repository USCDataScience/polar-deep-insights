(function(){

  var app = angular.module("polar.components.analytics.geoDiversity");
  app.controller("polar.components.analytics.geoDiversity.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler",
  function ($scope, Document, $FilterParser, StateHandler){

    function init(){
      $scope.state = StateHandler.getInstance(false, true);

      $scope.options = {
        maxZoom: 14,
        minZoom: 2,
        maxBounds: {
          northEast: {
            lat: 90,
            lng: 180,
          },
          southWest: {
            lat: -90,
            lng: -180,
          }
        },
      };

      $scope.center = {
        lat: 0,
        lng: 0,
        zoom: 2
      };

      $scope.events = {
        map: {
          enable: ['moveend', 'popupopen'],
          logic: 'emit'
        },
        marker: {
          enable: [],
          logic: 'emit'
        }
      };

      $scope.layers = {
        baselayers: {
          osm: {
            name: 'OpenStreetMap',
            type: 'xyz',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        },
        overlays: {
          realworld: {
            name: "Trec Polar Data",
            type: "markercluster",
            visible: true
          }
        }
      };

      $scope.map = { };
      $scope.map.markers = { };

      loadData();
    };

    function loadData(){
      $scope.state.initiate();
      Document.aggregateByLocations($FilterParser($scope.filters)).then(function(d){
        $scope.map.markers = _.chain(d.aggregations.entities.entity_name.buckets)
                               .reduce(function(m, l, i){
                                  m["marker"+i] = {
                                    message: l.key,
                                    lat: l.lat.value,
                                    lng: l.lon.value,
                                    size: l.doc_count,
                                    draggable: false,
                                    layer: 'realworld',
                                  };
                                  return m;
                               }, { })
                               .value();

        $scope.state.success();
      }, function(){
        $scope.state.fatal();
      });
    };

    $scope.$on('polar.components.analytics.reloadData.GeoDiversity', function(e){
      loadData();
    });

    init();
  }]);

}());
