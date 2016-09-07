(function(){
  var app = angular.module("polar.components.analytics.measurement");
  app.controller("polar.components.analytics.measurement.HistController", [ "$scope", "polar.data.Measurement", "polar.util.services.StateHandler", "$timeout",
    function($scope, Measurement, StateHandler, $timeout){
      function init(){
        $scope.state = StateHandler.getInstance();

        $scope.state.initiate();
        Measurement.fetchDistribution($scope.unit, $scope.filters).then(function(r){
          $scope.state.success();

          var units = _.chain(r).map(parseResp).flatten().value();
          var normalizationFactor = _.max(units);
          var normUnits = _.map(units,function(a){ return a / (normalizationFactor) });

          $scope.data = [{
            key: $scope.unit,
            values: genValues(normUnits, normalizationFactor),
          }];

        }, function(){
          $scope.state.fatal();
        });

        $scope.list = [ ];

        $scope.init = init;
      };

      function reDraw(bucket){
        if(bucket.values.length < 10){
          return;
        };

        var nB = _.map(bucket.values, function(b){ return bucket.nf * b });
        var norm = _.max(nB);
        var normalized = _.map(nB, function(b){ return b / norm });

        $scope.data = [{
          key: $scope.unit,
          values: genValues(normalized, norm),
        }];
      };


      function genValues(nUnits, normalizationFactor){
        var bins = d3.layout.histogram()
              .bins(10)
              .range([0, 1])
              (nUnits);

        var values = _.map(bins, function(b,i){
          vList = _.chain(b).map(function(x){ return parseFloat((x*normalizationFactor).toFixed(2)); }).sortBy().value();
          return {
            label: "B" + (i+1),
            x: b.x,
            dx: b.dx,
            nf: normalizationFactor,
            range: (b.x*normalizationFactor).toFixed(2) + "-" + ((b.x + b.dx)*normalizationFactor).toFixed(2),
            value: parseInt(b.length),
            values: b,
            avg: _.chain(vList).reduce(function(m,v){ return m + v; }, 0).value() / vList.length,
            list: _.chain(vList).unique().value(),
          }
        });

        return values;
      };

      function parseResp(r){
        return _.chain(r.hits.hits)
         .map(function(d){ return d.inner_hits['measurements'].hits.hits })
         .flatten()
         .pluck("_source")
         .map(function(d){
            return d.parsedValue;
         })
         .value();
      };

      $scope.$on("polar-measurement-histogram-redraw", function(e,d){
        reDraw(d);
        $scope.$apply();
      });

      $scope.$on('polar-measurement-histogram-mouseover', function(e, d){
        $scope.list = d.list;
        $scope.range = d.range;
        $scope.avg = d.avg;
        $scope.showMeta = true;
        $scope.$apply();
      });

      $scope.$on('polar-measurement-histogram-mouseout', function(e, d){
        $scope.showMeta = false;
        $scope.$apply();
      });

      init();
    }
  ]);
}());
