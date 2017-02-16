(function(){

  var app = angular.module("polar.components.analytics.geoDistribution");

  app.directive("polarAnalyticsGeoDiversity", ["$timeout", "leafletData", function($timeout, leafletData){
    return{
      scope: {
        filters: "=",
      },
      replace: true,

      templateUrl: "app/scripts/components/analytics/geo_diversity/template.html",
      controller: "polar.components.analytics.geoDiversity.Controller",

      link: function($scope, elem, attrs){

        leafletData.getMap().then(function(map){
          $scope.map = map;
        });

      }
    };
  }]);

}());
