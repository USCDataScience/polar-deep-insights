(function(){

  var app = angular.module("polar.components.footer");

  app.directive("polarFooter", [function(){
    return{
      scope: { },
      replace: true,

      templateUrl: "app/scripts/components/footer/template.html",
      controller: "polar.util.controllers.StaticPageController",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
