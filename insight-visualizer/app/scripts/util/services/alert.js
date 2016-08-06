(function(){

  angular.module("polar.util.services")

  .service("polar.util.services.$Alert", ["$uibModal", "$q", function($uibModal, $q){

    var M = function(){};

    M.open = function(d){
      var deferred = $q.defer();
      $uibModal.open({
        animation: true,
        templateUrl: 'app/scripts/util/templates/alert.html',
        controller: 'polar.util.controllers.modal.Controller',
        size: ( d.size || 'md' ),
        resolve: {
          data: function(){ return d; }
        }
      }).result.then(function(){
        deferred.resolve();
      }, function(){
        deferred.resolve();
      });
      return deferred.promise;
    };

    return M;

  }]);

}());
