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
        f.measurements    = nF.measurements || [ ];
        f.entities        = nF.entities || [ ];
        f.regions         = nF.regions || [ ];
        f.timeRanges      = nF.timeRanges || [ ];
        f.factory         = nF.factory ||  {};

        f.$valid = ( f.entities && f.entities.length > 0 )  ||
                   ( f.measurements && f.measurements.length > 0 )  ||
                   ( f.regions && f.regions.length > 0 )       ||
                   ( f.timeRanges && f.timeRanges.length > 0 ) ||
                   ( f.factory.concepts && f.factory.concepts.length > 0 );
      });
    };

    init();
  }]);

}());
