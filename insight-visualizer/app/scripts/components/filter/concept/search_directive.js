(function(){

  var app = angular.module("polar.components.filter.concept");

  app.directive("polarFilterConceptSearch", [function(){
    return{
      scope: {
        filter: "=",
        helpers: "=",
      },
      replace: true,

      templateUrl: "app/scripts/components/filter/concept/search_template.html",
      controller: "polar.components.filter.concept.SearchController",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
