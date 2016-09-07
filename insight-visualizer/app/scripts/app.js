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
  "ui.sortable",
])

.config(["$routeProvider", function ($routeProvider){
  var resolutions = {
    config: ["polar.data.Config", "$q", "$location", function(Config, $q, $location){
      var defer = $q.defer();
      if(Config.isSet()){
        defer.resolve();
      } else {
        $location.path('/config');
        defer.reject();
      };
      defer.resolve();
      return defer.promise;
    }],

    entityCount: ["polar.data.EntityCount", "$q", "$location", function(EntityCount, $q, $location){
      var defer = $q.defer();
      if(EntityCount.isSet()){
        defer.resolve();
      } else {
        $location.path('/config');
        defer.reject();
      };
      defer.resolve();
      return defer.promise;
    }],

    ontology: ["polar.data.ConceptFactory", "$q", "$location", function(ConceptFactory, $q, $location){
      var defer = $q.defer();
      if(ConceptFactory.isSet()){
        defer.resolve();
      } else {
        $location.path('/config');
        defer.reject();
      };
      defer.resolve();
      return defer.promise;
    }]
  };

  $routeProvider
    .when('/concept_editor', {
      templateUrl: 'app/scripts/sections/home/concept_editor.html',
      controller: 'polar.util.controllers.StaticPageController',
      resolve: {
        configration: resolutions.config,
      }
    })

    .when('/query', {
      templateUrl: 'app/scripts/sections/home/query.html',
      controller: 'polar.util.controllers.StaticPageController',
      resolve: {
        configration: resolutions.config,
        ontology: resolutions.ontology,
        //entityCount: resolutions.entityCount,
      }
    })

    .when('/query/:type', {
      templateUrl: 'app/scripts/sections/home/query.html',
      controller: 'polar.util.controllers.StaticPageController',
      resolve: {
        configration: resolutions.config,
        ontology: resolutions.ontology,
        //entityCount: resolutions.entityCount,
      }
    })

    .when('/config', {
      templateUrl: 'app/scripts/sections/home/config.html',
      controller: 'polar.util.controllers.StaticPageController',
    })

    .when('/measurement_editor', {
      templateUrl: 'app/scripts/sections/home/measurement_editor.html',
      controller: 'polar.util.controllers.StaticPageController',
    })

    .otherwise({
      redirectTo: '/config'
    });
}])

.run(["polar.data.Config", "polar.data.EntityCount", function(Config, EntityCount){
  // Load application configuration
  Config.load();
  EntityCount.fetch();
}]);
