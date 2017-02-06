(function(){

  var app = angular.module("polar.components.analytics.geoDistribution");

  app.directive("polarAnalyticsGeoDistribution", ["$timeout", function($timeout){
    return{
      scope: {
        filters: "=",
      },
      replace: true,

      templateUrl: "app/scripts/components/analytics/geo_distribution/template.html",
      controller: "polar.components.analytics.geoDistribution.Controller",

      link: function($scope, elem, attrs){
        var cont = elem.find(".idf-location")[0];
        var bubble_map = new Datamap({
          element: cont,
          height: 800,
          width: $(".query-result").width(),
          geographyConfig: {
            popupOnHover: false,
            highlightOnHover: false,
            hideAntarctica: false,
          },
          fills: {
            defaultFill: '#ABDDA4',
            USA: 'red',
          }
        });

        var loadMap = function(data){
          bubble_map.bubbles(data, {
            popupTemplate: function(geo, d) {
              return '<div class="hoverinfo">Name:' + d.name + '</div>';
            }
          });
        };

        $scope.loadMap = loadMap;

        $timeout(function(){
          $scope.$broadcast('reCalcViewDimensions');
        }, 100);
      }
    };
  }]);

}());
