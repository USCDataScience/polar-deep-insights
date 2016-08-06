(function(){

  angular.module("polar.components.conceptEditor.export")

  .service("polar.components.conceptEditor.export.$Modal", ["$uibModal", function($uibModal){

    var M = function(){};

    M.open = function(f){
      return $uibModal.open({
        animation: true,
        templateUrl: 'app/scripts/components/concept_editor/export/modal_template.html',
        controller: 'polar.util.controllers.modal.Controller',
        size: 'lg',
        resolve: {
          data: function(){ return { factory: f }; }
        }
      }).result;
    };

    return M;

  }]);

}());
