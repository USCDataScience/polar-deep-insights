(function(){

  var app = angular.module("polar.components.filter.concept");

  app.directive("polarFilterConcept", [function(){
    return{
      scope: {
        filter: "="
      },
      replace: true,

      templateUrl: "app/scripts/components/filter/concept/template.html",
      controller: "polar.components.filter.concept.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
