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
        // your DOM manipulation logic for this component goes here
        $scope.$watch("field", function(nv){
          if(nv == 'tf-idf'){
            $scope.fn = 'sum';
          };
        });
      }
    };
  }]);

}());
