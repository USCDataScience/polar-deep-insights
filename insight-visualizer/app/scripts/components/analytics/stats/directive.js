(function(){

  var app = angular.module("polar.components.analytics.stats");

  app.directive("polarAnalyticsStats", [function(){
    return{
      scope: {
        filters: "=",
      },
      replace: true,

      templateUrl: "app/scripts/components/analytics/stats/template.html",
      controller: "polar.components.analytics.stats.Controller",

      link: function($scope, elem, attrs){
         $scope.options = {
            chart: {
                type: 'pieChart',
                height: 450,
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                pie: {
                  startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
                  endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
                },
                duration: 500,
                legend: {
                  margin: {
                    top: 5,
                    right: 70,
                    bottom: 5,
                    left: 0
                  }
                }
            }
        };

        $scope.typeOptions = {
            chart: {
                type: 'pieChart',
                height: 1000,
                x: function(d){ return d.key.split(";")[0].substring(0, 25); },
                y: function(d){ return d.doc_count; },
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };
      }
    };
  }]);

}());
