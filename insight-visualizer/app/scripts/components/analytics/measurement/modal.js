(function(){

  angular.module("polar.components.analytics.measurement")

  .service("polar.components.analytics.measurement.$HistModal", ["$uibModal", function($uibModal){

    var M = function(){};

    M.open = function(f){

      return $uibModal.open({
        animation: true,
        templateUrl: 'app/scripts/components/analytics/measurement/hist_modal_template.html',
        controller: 'polar.util.controllers.modal.Controller',
        size: "md",
        resolve: {
          data: function(){ return { unit: f.unit, filters: f.filters }; }
        }
      }).result;
    };

    return M;

  }]);

}());
