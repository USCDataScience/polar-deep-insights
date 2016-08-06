(function(){
  angular.module("tg.graph.aside")

  .factory("tg.graph.aside.$aside", ["$rootScope", function($rootScope){

    function Aside(){ };

    Aside.open = function(element){
      $rootScope.$broadcast("tg.events.graph.aside.open", element);
    };

    Aside.close = function(element){
      $rootScope.$broadcast("tg.events.graph.aside.open");
    };

    Aside.refresh = function(element){
      $rootScope.$broadcast("tg.events.graph.aside.refresh", element);
    };

    Aside.open

    return Aside;

  }])

}())
