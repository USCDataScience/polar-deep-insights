(function(){

  var app = angular.module("polar.components.filter.docType");

  app.directive("polarFilterDocType", [function(){
    return{
      scope: {
        filter: "="
      },
      replace: true,

      templateUrl: "app/scripts/components/filter/doc_type/template.html",
      controller: "polar.components.filter.docType.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
