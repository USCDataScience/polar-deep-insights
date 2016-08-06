(function(){
  var app = angular.module("c.components.flash");
  app.directive("cFlash", [function(){
    return{
      scope:{},
      replace: true,
      templateUrl: "app/scripts/components/flash/template.html",
      controller: "c.components.flash.Controller"
    };
  }]);
}());
