(function(){

  angular.module("polar.components.addFilter")

  .service("polar.components.addFilter.$TypeModal", ["$uibModal", function($uibModal){

    var M = function(){};

    M.open = function(){
      return $uibModal.open({
        animation: true,
        templateUrl: 'app/scripts/components/add_filter/modal_template.html',
        controller: 'polar.util.controllers.modal.Controller',
        size: 'sm',
        resolve: {
          data: { }
        }
      }).result;
    };

    return M;

  }]);

}())
