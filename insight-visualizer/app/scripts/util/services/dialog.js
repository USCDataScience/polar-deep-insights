(function(){

  angular.module("polar.util.services")

  .service("polar.util.services.$Dialog", ["$uibModal", function($uibModal){

    var M = function(){};

    M.open = function(d){
      return $uibModal.open({
        animation: true,
        templateUrl: 'app/scripts/util/templates/dialog.html',
        controller: 'polar.util.controllers.modal.Controller',
        size: ( d.size || 'md' ),
        resolve: {
          data: function(){ return d; }
        }
      }).result;
    };

    return M;

  }]);

}());
