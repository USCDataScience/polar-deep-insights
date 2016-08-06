(function(){

  var app = angular.module("polar.components.analytics.measurement");

  app.directive("polarAnalyticsMeasurement", [function(){
    return{
      scope: {
        filters: "=",
      },
      replace: true,

      templateUrl: "app/scripts/components/analytics/measurement/template.html",
      controller: "polar.components.analytics.measurement.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
