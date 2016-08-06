(function(){

  angular.module("polar.components.conceptEditor.concept")

  .service("polar.components.conceptEditor.concept.$Modal", ["$uibModal", function($uibModal){

    var M = function(){};

    M.open = function(c){
      return $uibModal.open({
        animation: true,
        templateUrl: 'app/scripts/components/concept_editor/concept/modal_template.html',
        controller: 'polar.util.controllers.modal.Controller',
        size: 'sm',
        resolve: {
          data: function(){ return { concept: c }; }
        }
      }).result;
    };

    return M;

  }]);

}());
