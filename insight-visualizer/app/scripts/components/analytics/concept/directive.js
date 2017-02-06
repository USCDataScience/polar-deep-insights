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
            height: 500,
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
        $scope.api = { };
      }

    };
  }]);

}());
