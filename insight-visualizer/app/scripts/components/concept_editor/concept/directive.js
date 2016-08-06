(function(){

  var app = angular.module("polar.components.conceptEditor.concept");

  app.directive("polarConceptBox", [function(){
    return{
      scope: {
        concept: "=",
        validator: "&",
      },
      replace: true,

      templateUrl: "app/scripts/components/concept_editor/concept/template.html",
      controller: "polar.components.conceptEditor.concept.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
