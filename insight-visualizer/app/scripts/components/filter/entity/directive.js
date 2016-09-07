(function(){

  var app = angular.module("polar.components.filter.entity");

  app.directive("polarFilterEntity", [function(){
    return{
      scope: {
        filter: "="
      },
      replace: true,

      templateUrl: "app/scripts/components/filter/entity/template.html",
      controller: "polar.components.filter.entity.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
