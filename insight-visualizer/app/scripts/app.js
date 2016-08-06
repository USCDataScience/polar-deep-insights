'use strict';

/**
 * @ngdoc overview
 * @name polar
 * @description
 * # polar
 *
 * Main module of the application.
 */
angular
.module('polar', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'LocalStorageModule',
  'polar.components',
  'polar.data',
  'polar.sections',
  'polar.util',
  "ui.bootstrap",
])

.config(["$routeProvider", function ($routeProvider) {
  $routeProvider
    .when('/concept_editor', {
      templateUrl: 'app/scripts/sections/home/concept_editor.html',
      controller: 'polar.util.controllers.StaticPageController'
    })

    .when('/query', {
      templateUrl: 'app/scripts/sections/home/query.html',
      controller: 'polar.util.controllers.StaticPageController'
    })

    .otherwise({
      redirectTo: '/concept_editor'
    });
}]);
