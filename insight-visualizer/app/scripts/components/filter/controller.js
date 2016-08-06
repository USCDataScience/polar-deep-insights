(function(){

  var app = angular.module("polar.components.filter");
  app.controller("polar.components.filter.Controller",
  [ "$scope", "polar.components.filter.$EditModal",
  function ($scope, $EditModal){

    function init(){
      $scope.edit = edit;
    };

    function edit(f){
      $EditModal.open(angular.copy(f)).then(function(nF){
        f.regions    = nF.regions || [ ];
        f.timeRanges = nF.timeRanges || [ ];
        f.factory    = nF.factory || [ ];

        f.$valid = ( f.regions && f.regions.length > 0 )       ||
                   ( f.timeRanges && f.timeRanges.length > 0 ) ||
                   ( f.factory.concepts.length > 0 );
      });
    };

    init();
  }]);

}());
