(function(){

  var app = angular.module("polar.components.analytics.concept");

  app.directive("polarAnalyticsConcept", [function(){
    return{
      scope: {
        filters: "=",
      },
      replace: true,

      templateUrl: "app/scripts/components/analytics/concept/template.html",
      controller: "polar.components.analytics.concept.Controller",

      link: function($scope, element, attrs){
        $scope.options = {
          chart: {
            type: 'multiBarHorizontalChart',
            height: 950,
            width: 1150,
            margin : {
              left: 150
            },
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showControls: true,
            showValues: true,
            duration: 500,
            xAxis: {
              showMaxMin: false
            },
            yAxis: {
              axisLabel: 'Value',
              tickFormat: function(d){
                return d3.format(',.2f')(d);
              }
            }
          }
        };

        var color = d3.scale.category20();
        $scope.gOptions = {
          chart: {
            type: 'forceDirectedGraph',
            height: 600,
            width: 1150,
            margin:{top: 20, right: 20, bottom: 20, left: 20},
            color: function(d){
              return color(d.group)
            },
            nodeExtras: function(node) {
              node && node
                .append("text")
                .attr("dx", 8)
                .attr("dy", ".35em")
                .text(function(d) { return d.id })
                .style('font-size', '12px');
            },
            tooltip: false
          }
        };
      }
    };
  }]);

}());
