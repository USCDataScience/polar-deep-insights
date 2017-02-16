(function(){

  var app = angular.module("polar.components.analytics.geoDiversity");
  app.controller("polar.components.analytics.geoDiversity.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler",
  function ($scope, Document, $FilterParser, StateHandler){

    function init(){
      $scope.state = StateHandler.getInstance(false, true);
      $scope.params = {
        epsilon: 50,
        group: 10
      };

      $scope.points     = [ ];
      $scope.candidates = [ ];

      var heatmap = {
        name: 'Heat Map',
        type: 'heat',
        data: $scope.candidates,
        visible: true
      };


     $scope.center = {
        lat: 0,
        lng: 0,
        zoom: 2
     };

     $scope.layers = {
        baselayers: {
          osm: {
            name: 'OpenStreetMap',
            type: 'xyz',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        },
        overlays: { }
      };

      $scope.options = {
        maxZoom: 5,
        minZoom: 2,
        maxBounds: {
          northEast: {
            lat: 95,
            lng: 180,
          },
          southWest: {
            lat: -95,
            lng: -180,
          }
        },
      };

      $scope.slider = { value: 500 };

      // $scope.center = {
      //   lat: 0,
      //   lng: 0,
      //   zoom: 2
      // };

      // $scope.events = {
      //   map: {
      //     enable: ['moveend', 'popupopen'],
      //     logic: 'emit'
      //   },
      //   marker: {
      //     enable: [],
      //     logic: 'emit'
      //   }
      // };

      // $scope.layers = {
      //   baselayers: {
      //     osm: {
      //       name: 'OpenStreetMap',
      //       type: 'xyz',
      //       url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      //     }
      //   },
      //   overlays: {
      //     realworld: {
      //       name: "Trec Polar Data",
      //       type: "markercluster",
      //       visible: true
      //     }
      //   }
      // };

      // $scope.map = { };
      // $scope.map.markers = { };

      loadData();
    };

    function loadData(){
      $scope.state.initiate();
      Document.aggregateByLocations($FilterParser($scope.filters), $scope.field, $scope.slider.value).then(function(d){

        $scope.map.invalidateSize();

        $scope.points = _.chain(d.aggregations.entities.entity_name.buckets)
         .map(function(l){
          return [l.lat.value, l.lon.value, l.entity_stats[$scope.fn]];
         })
         .value();

        var sorted = _.sortBy($scope.points, function(p){ return p[2] });

        var maxVal = sorted[sorted.length - 1][ 2 ];
        var limeLimit = sorted[parseInt(sorted.length * 0.6)][ 2 ] / maxVal;
        var redLimit = sorted[parseInt(sorted.length * 0.95)][ 2 ] / maxVal;

        $scope.points = _.map($scope.points, function(p){
          return [ p[0], p[1], p[2]/maxVal ];
        });


        var gradient = {  };
        gradient['0.01'] = 'blue';
        gradient['0.7'] = 'lime';
        gradient['0.95']  = 'red';

         $scope.layers.overlays = {
            heat: {
              name: 'Heat Map',
              type: 'heat',
              data: $scope.points,
              doRefresh: true,
              layerOptions: {
                radius: 5,
                blur: 5,
                gradient: gradient,
              },
              visible: true
            }
         }

        // $scope.map.markers = _.chain(d.aggregations.entities.entity_name.buckets)
        //                        .reduce(function(m, l, i){
        //                           m["marker"+i] = {
        //                             message: l.key,
        //                             lat: l.lat.value,
        //                             lng: l.lon.value,
        //                             size: l.doc_count,
        //                             draggable: false,
        //                             layer: 'realworld',
        //                           };
        //                           return m;
        //                        }, { })
        //                        .value();

        // $scope.clusterAllocation = jDBSCAN().eps($scope.params.epsilon).minPts($scope.params.group).distance('EUCLIDEAN').data($scope.points)();
        // $scope.clusterAllocation = jDBSCAN().eps(30).minPts(1).distance('EUCLIDEAN').data($scope.points)();
        // _.each($scope.clusterAllocation, function(c,i){
        //   $scope.points[i].cluster = c;
        // });

        // $scope.clusters = _.groupBy($scope.points, function(p){
        //   return p.cluster
        // });

        // $scope.candidates = _.map($scope.clusters, function(v,k){
        //   var candidate = _.sample(v);
        //   return {
        //     cluster: k,
        //     lat: candidate.y,
        //     lon: candidate.x,
        //     size: v.length
        //   };
        // });


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
