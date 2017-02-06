(function(){

  var app = angular.module("polar.components.analytics");

  app.directive("polarAnalytics", ["$location", "$timeout", function($location, $timeout){
    return{
      scope: {
        filters: "=",
      },
      replace: true,

      templateUrl: "app/scripts/components/analytics/template.html",
      controller: "polar.components.analytics.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
        $scope.initTab = $attributes.startTab;

        var tabMapping = {
          0: "Time",
          1: "Geo",
          2: "Concept",
          3: "Measurement",
          4: "GeoDiversity",
          5: "PopularEntities",
          6: "Stats",
        };

        var tabInverseMapping = {
          "Time": 0,
          "Geo": 1,
          "Concept": 2,
          "Measurement": 3,
          "GeoDiversity": 4,
          "PopularEntities": 5,
          "Stats": 6,
        };

        $timeout(function(){
          $scope.active = ( tabInverseMapping[$scope.initTab] || 6 );
        }, 500);


        $scope.fullScreen = function(){
          $(".query-result").requestFullScreen();
        };
      }
    };
  }]);

}());
