angular.module("polar.util.directives")
.directive("cGlobalLoader",[
  function(){
    return {
      scope: {
        delay: "=?",
        heavyLoading: "="
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
          function set(val, delay){
            $timeout(function(){
              $scope.loaderConfig = val;
              $scope.heavyLoading = _.any($scope.queue, function(q){ return q.heavyLoader });
            }, delay || 0);
          };

          $timeout(function(){
            if(nv > 0){
              if($scope.queue.length > 0) { set(loaderConfig); }
              else { set(null, $scope.delay); };
            } else {
              set(null, $scope.delay);
            };
          }, 0);

        });
      }]
    };
  }
]);
