(function(){

  angular.module("polar.components.filter")

  .service("polar.components.filter.$EditModal", ["$uibModal", function($uibModal){

    var M = function(){};

    M.open = function(f){

      var size = f.type == 'geo' || f.type == 'concept' ? 'lg' : 'md';

      return $uibModal.open({
        animation: true,
        templateUrl: 'app/scripts/components/filter/edit_modal_template.html',
        controller: 'polar.util.controllers.modal.Controller',
        size: size,
        resolve: {
          data: function(){ return { filter: f }; }
        }
      }).result;
    };

    return M;

  }]);

}());
