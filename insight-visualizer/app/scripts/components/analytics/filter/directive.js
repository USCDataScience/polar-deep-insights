(function(){

  var app = angular.module("polar.components.analytics.filter");

  app.directive("polarAnalyticsFilter", [function(){
    return{
      scope: {
        field: "=",
        fn   : "=",
      },
      replace: true,

      templateUrl: "app/scripts/components/analytics/filter/template.html",

      link: function($scope, $element, $attributes){

      }
    };
  }]);

}());
