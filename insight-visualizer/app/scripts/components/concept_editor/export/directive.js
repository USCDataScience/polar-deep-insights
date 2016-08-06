(function(){

  var app = angular.module("polar.components.conceptEditor.export");

  app.directive("polarConceptExport", [function(){
    return{
      scope: {
        factory: "="
      },
      replace: true,

      templateUrl: "app/scripts/components/concept_editor/export/template.html",
      controller: "polar.components.conceptEditor.export.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
