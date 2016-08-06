(function(){

  var app = angular.module("polar.components.filter.time");

  app.directive("polarFilterTime", [function(){
    return{
      scope: {
        filter: "="
      },
      replace: true,

      templateUrl: "app/scripts/components/filter/time/template.html",
      controller: "polar.components.filter.time.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
