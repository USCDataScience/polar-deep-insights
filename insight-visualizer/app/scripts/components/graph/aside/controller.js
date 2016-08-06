(function(){
  var app = angular.module("tg.graph.aside");

  app.controller("tg.graph.aside.Controller", [ "$scope", "$rootScope", "$timeout",
    function($scope, $rootScope, $timeout){
      function init(){
        $rootScope.$on("tg.events.graph.aside.open", function(event, element){
          $scope.element = element;
          $scope.show = true;
          $scope.$apply();
        });

        $rootScope.$on("tg.events.graph.aside.close", function(event, element){
          $scope.show = false;
          $scope.$apply();
        });

        $rootScope.$on("tg.events.graph.aside.refresh", function(event, element){
          if($scope.show){
            $scope.element = element;
          };
          $scope.$apply();
        });

        $scope.close = close;
      };

      function close(){
        $scope.show = false;
      };

      init();
    }
  ]);
}());
