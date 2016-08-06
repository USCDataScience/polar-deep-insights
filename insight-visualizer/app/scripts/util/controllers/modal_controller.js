angular.module('polar.util.controllers')

.controller('polar.util.controllers.modal.Controller', function ($scope, $uibModalInstance, data) {

  $scope.data = data;

  $scope.ok = function(obj) {
    $uibModalInstance.close(obj);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});
