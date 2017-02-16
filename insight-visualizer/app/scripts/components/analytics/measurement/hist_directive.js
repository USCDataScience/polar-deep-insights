(function(){

  var app = angular.module("polar.components.analytics.measurement");

  app.directive("polarAnalyticsMeasurementHistogram", [function(){
    return{
      scope: {
        unit: "=",
        filters: "=",
        type: "="
      },
      replace: true,

      templateUrl: "app/scripts/components/analytics/measurement/hist_template.html",
      controller: "polar.components.analytics.measurement.HistController",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
        $scope.options = {
            chart: {
              type: 'discreteBarChart',
              height: 450,
              margin : {
                top: 20,
                right: 20,
                bottom: 50,
                left: 55
              },
              x: function(d){ return d.label; },
              y: function(d){ return d.value; },
              showValues: true,
              duration: 500,
              xAxis: {
                axisLabel: 'Buckets'
              },
              yAxis: {
                axisLabel: 'Frequency',
                axisLabelDistance: -10
              },
              callback: function(chart){
                attachEvents(chart.discretebar.dispatch);
                console.log()
              }
            }
        };

        function attachEvents(dispatch){
          dispatch.on('elementMouseover.tooltip', function(event){
            $scope.$emit('polar-measurement-histogram-mouseover', event.data);
          });
          dispatch.on('elementMouseout.tooltip', function(event){
            $scope.$emit('polar-measurement-histogram-mouseout', event.data);
          });

          dispatch.on('elementClick.tooltip', function(event){
            $scope.$emit('polar-measurement-histogram-redraw', event.data);
          });
        };
      }
    };
  }]);

}());
