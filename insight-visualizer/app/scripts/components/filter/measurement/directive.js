(function(){

  var app = angular.module("polar.components.filter.measurement");

  app.directive("polarFilterMeasurement", [function(){
    return{
      scope: {
        filter: "="
      },
      replace: true,

      templateUrl: "app/scripts/components/filter/measurement/template.html",
      controller: "polar.components.filter.measurement.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
