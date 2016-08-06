(function(){

  var app = angular.module("polar.components.conceptEditor");

  app.directive("polarConceptEditor", [function(){
    return{
      scope: { },
      replace: true,

      templateUrl: "app/scripts/components/concept_editor/template.html",
      controller: "polar.components.conceptEditor.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
