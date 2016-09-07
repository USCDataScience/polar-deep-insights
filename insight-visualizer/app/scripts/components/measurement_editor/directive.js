(function(){

  var app = angular.module("polar.components.measurementEditor");

  app.directive("polarMeasurementEditor", [function(){
    return{
      scope: { },
      replace: true,

      templateUrl: "app/scripts/components/measurement_editor/template.html",
      controller: "polar.components.measurementEditor.Controller",

      link: function($scope, $element, $attributes){
        // your DOM manipulation logic for this component goes here
        $scope.sortableOptions = {
          placeholder: "measurements",
          connectWith: ".measurements-container",
          update: function(e, ui){
            $scope;

            if(!ui.item.sortable.received &&
                ui.item.sortable.source[0] !== ui.item.sortable.droptarget[0] &&
                ui.item.sortable["source"].hasClass('source') && ui.item.sortable["droptarget"].hasClass('target')
              ){
              ui.item.sortable.model.group = $scope.groups[$scope.selectedGroup];
            };

            if(!ui.item.sortable.received &&
                ui.item.sortable.source[0] !== ui.item.sortable.droptarget[0] &&
                ui.item.sortable["source"].hasClass('target') && ui.item.sortable["droptarget"].hasClass('source')
              ){
              ui.item.sortable.model.group = null;
            };
          }
        };
      }
    };
  }]);

}());
