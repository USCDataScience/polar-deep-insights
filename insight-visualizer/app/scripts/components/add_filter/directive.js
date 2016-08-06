(function(){

  var app = angular.module("polar.components.addFilter");

  app.directive("polarAddFilter", [function(){
    return{
      scope: {
        "filters": "="
      },
      replace: true,

      templateUrl: "app/scripts/components/add_filter/template.html",
      controller: "polar.components.addFilter.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
