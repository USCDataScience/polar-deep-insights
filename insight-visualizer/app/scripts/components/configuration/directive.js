(function(){

  var app = angular.module("polar.components.configuration");

  app.directive("polarConfiguration", [function(){
    return{
      scope: { },
      replace: true,

      templateUrl: "app/scripts/components/configuration/template.html",
      controller: "polar.components.configuration.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
