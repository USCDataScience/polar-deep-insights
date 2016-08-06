(function(){

  var app = angular.module("polar.components.navigation");

  app.directive("polarNavigation", [function(){
    return{
      scope: { },
      replace: true,

      templateUrl: "app/scripts/components/navigation/template.html",
      controller: "polar.components.navigation.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
