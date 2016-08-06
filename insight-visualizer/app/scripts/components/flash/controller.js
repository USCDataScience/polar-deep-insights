(function(){
  var app = angular.module("c.components.flash");
  app.controller("c.components.flash.Controller", [ "$scope", "$rootScope",
    function($scope, $rootScope){
      function init(){
        $rootScope.$on("c.events.flash", function(event, flashConfig){
          $scope.flashConfig = flashConfig;
          $scope.closeFlash = false;
        });

        $rootScope.$on('$routeChangeStart', function(event){
          $scope.flashConfig = null;
          $scope.closeFlash = true;
        });

        $scope.close = close;
      };

      function close(){
        $scope.closeFlash = true;
      };

      init();
    }
  ]);
}());
