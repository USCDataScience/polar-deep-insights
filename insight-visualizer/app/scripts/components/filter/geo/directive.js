(function(){

  var app = angular.module("polar.components.filter.geo");

  app.directive("polarFilterGeo", [function(){
    return{
      scope: {
        filter: "="
      },
      replace: true,

      templateUrl: "app/scripts/components/filter/geo/template.html",
      controller: "polar.components.filter.geo.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
      }
    };
  }]);

}());
