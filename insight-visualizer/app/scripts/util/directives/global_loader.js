angular.module("polar.util.directives")
.directive("cGlobalLoader",[
  function(){
    return {
      scope: {
        delay: "=?"
      },
      replace: true,
      templateUrl: "app/scripts/util/templates/global_loader.html",
      controller: ["$scope", "polar.util.services.StateHandler", "$timeout", function($scope, StateHandler, $timeout){
        var delay = $scope.delay || 200,
            loaderConfig = {
              message: "Working, Please wait..."
            };
        function init(){
          $scope.queue = StateHandler.queue;
        };
        init();

        $scope.$watch(function(){
          return $scope.queue.length;
        }, function(nv, ov){
          $timeout(function(){
            if(nv > 0){
              if($scope.queue.length > 0) { $scope.loaderConfig = loaderConfig; }
              else { $scope.loaderConfig = null; }
            } else {
              $scope.loaderConfig = null;
            };
          }, 0);
        });
      }]
    };
  }
]);
