(function(){

  var app = angular.module("polar.components.analytics.geoDistribution");

  app.directive("polarAnalyticsGeoDiversity", [function(){
    return{
      scope: {
        filters: "=",
      },
      replace: true,

      templateUrl: "app/scripts/components/analytics/geo_diversity/template.html",
      controller: "polar.components.analytics.geoDiversity.Controller",

      link: function($scope, elem, attrs){

      }
    };
  }]);

}());
