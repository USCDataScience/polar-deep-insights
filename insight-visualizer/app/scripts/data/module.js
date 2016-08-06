angular.module("polar.data", [
  'LocalStorageModule',
  "polar.util",
])
.config(["localStorageServiceProvider", function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('polar');
}]);
