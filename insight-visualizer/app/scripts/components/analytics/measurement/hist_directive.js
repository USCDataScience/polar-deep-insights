(function(){

  var app = angular.module("polar.components.analytics.measurement");

  app.directive("polarAnalyticsMeasurementHistogram", [function(){
    return{
      scope: {
        unit: "=",
        filters: "="
      },
      replace: true,

      templateUrl: "app/scripts/components/analytics/measurement/hist_template.html",
      controller: "polar.components.analytics.measurement.HistController",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here

        $scope.options = {
          chart: {
              type: 'scatterChart',
              height: 600,
              color: d3.scale.category10().range(),
              scatter: {
                  onlyCircles: false
              },
              showDistX: true,
              showDistY: true,
              duration: 350,
              xAxis: {
                  axisLabel: 'X Axis',
                  tickFormat: function(d){
                      return d3.format('.02f')(d);
                  }
              },
              yAxis: {
                  axisLabel: 'Y Axis',
                  tickFormat: function(d){
                      return d3.format('.02f')(d);
                  },
                  axisLabelDistance: -5
              },
              zoom: {
                  //NOTE: All attributes below are optional
                  enabled: true,
                  scaleExtent: [1, 10],
                  useFixedDomain: false,
                  useNiceScale: false,
                  horizontalOff: false,
                  verticalOff: false,
                  unzoomEventType: 'dblclick.zoom'
              }
          }
        };

      }
    };
  }]);

}());
