(function(){

  var app = angular.module("polar.components.filter");

  app.directive("polarFilter", [function(){
    return{
      scope: {
        filter: "=",
        onDelete: "&",
      },
      replace: true,

      templateUrl: "app/scripts/components/filter/template.html",
      controller: "polar.components.filter.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
