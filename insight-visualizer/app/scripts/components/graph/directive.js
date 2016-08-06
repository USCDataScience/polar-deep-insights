angular.module("tg.graph")

.directive('tgGraph', ["Visualizer", function(Visualizer){
  return {
    restrict: 'A',
    scope: {
      behavior: "=?",
      configration: "&",
      stream: "=",
      metadata: "&",
      nodeMenu: "&",
      edgeMenu: "&",
      onLoad: "&",
      helpers: "=?",
    },
    link: function($scope, element, attrs){
      function loadGraph(){
        $scope.graph = Visualizer.Engine.create(
          element[0],
          $scope.configration(),
          $scope.metadata(),
          $scope.nodeMenu(),
          $scope.edgeMenu()
        );

        $scope.graph.data([ ]).draw();

        if($scope.onLoad){
          $scope.onLoad({ graph: $scope.graph });
        };
      };

      $scope.helpers = {
        fullScreen: function(){
          $scope.graph.fullScreen(element[0]);
        }
      };

      loadGraph();

      $scope.$watch("behavior", function(nv, ov){
        if(nv && $scope.graph){
          Visualizer.setup(nv);
          $scope.graph.redraw();
        };
      }, true);

      // $scope.$watch("stream", function(nv, ov){
      //   if(nv && $scope.graph){
      //     $scope.graph.data(nv).redraw();
      //   };
      // });
    }
  };
}]);
