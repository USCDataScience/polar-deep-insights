(function(){

  var app = angular.module("polar.components.filter.time");
  app.controller("polar.components.filter.time.Controller",
  [ "$scope", function ($scope){

    function init(){
      if(!$scope.filter.timeRanges){
        $scope.filter.timeRanges = [ ];
        addRange();
      };

      $scope.addRange = addRange;
    };

    function getNewRange(){
      var range = { };
      range.min = 1980;
      range.max = 1985;
      return range;
    };

    function addRange(){
      $scope.filter.timeRanges.push(getNewRange());
    };

    init();
  }]);

}());
