(function(){

  var app = angular.module("polar.components.analytics");

  app.directive("polarAnalytics", [function(){
    return{
      scope: {
        filters: "=",
      },
      replace: true,

      templateUrl: "app/scripts/components/analytics/template.html",
      controller: "polar.components.analytics.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
