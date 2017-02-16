(function(){

  var app = angular.module("polar.components.configuration");
  app.controller("polar.components.configuration.Controller",
  [ "$scope", "polar.data.Config", "polar.util.services.$Alert",
    "polar.util.services.StateHandler", "polar.data.ConceptFactory",
    "polar.data.EntityCount", "$timeout",
  function ($scope, Config, $Alert, StateHandler, ConceptFactory, EntityCount, $timeout){

    function init(){
      $scope.config = Config.getData();
      $scope.cFactory = ConceptFactory.getInstance();
      $scope.saveConfig = saveConfig;
      $scope.isConfigSet = isConfigSet;
      $scope.isOntologySet = isOntologySet;
      $scope.downloadOntology = downloadOntology;
      $scope.downloadEntityCount = downloadEntityCount;
      $scope.loadDefault = loadDefault;

      $scope.entityCountSet = EntityCount.isSet();
      $timeout(function(){
        $scope.entityCountSet = EntityCount.isSet();
      }, 500);
    };

    function loadDefault(type){
      if(type == 1){
        $scope.config = {
          endpoint: "http://polar.usc.edu/elasticsearch",
          index: "pdi-trec-dd-pdf",
          docType: "docs",
          ontologyIndex: "polar-ontology",
          ontologyDocType: "graph",
          measurementIndex: "polar-measurements",
          measurementDocType: "raw-measurements",
          entityCountPath: "http://polar.usc.edu/html/polar-deep-insights/data/entity-count-trec-dd-pdf.json",
          sweetOntologyPath: "http://polar.usc.edu/html/polar-deep-insights/data/ontology.json",
        }
      } else if( type == 2 ){
        $scope.config = {
          endpoint: "http://polar.usc.edu/elasticsearch",
          index: "pdi-trec-dd-sample",
          docType: "docs",
          ontologyIndex: "polar-ontology",
          ontologyDocType: "graph",
          measurementIndex: "polar-measurements",
          measurementDocType: "raw-measurements",
          entityCountPath: "http://polar.usc.edu/html/polar-deep-insights/data/entity-count-trec-dd-sample.json",
          sweetOntologyPath: "http://polar.usc.edu/html/polar-deep-insights/data/sweet.json",
        }
      } else {
        $scope.config = {
          endpoint: "http://polar.usc.edu/elasticsearch",
          index: "polar-deep-insights-complete",
          docType: "docs",
          ontologyIndex: "polar-ontology",
          ontologyDocType: "graph",
          measurementIndex: "polar-measurements",
          measurementDocType: "raw-measurements",
          entityCountPath: "http://polar.usc.edu/html/polar-deep-insights/data/entity-count-nsidc.json",
          sweetOntologyPath: "http://polar.usc.edu/html/polar-deep-insights/data/sea-ice.json",
        }
      }
    };

    function saveConfig(d){
      $Alert.open({ message: "Successfully saved configuration to local storage"})
      Config.save(d);
    };

    function isConfigSet(){
      return Config.isSet();
    };

    function isOntologySet(){
      return ConceptFactory.isSet();
    };

    function downloadEntityCount(){
      var state = StateHandler.getInstance();
      state.initiate();
      EntityCount.download()
      .then(function(r){
        $Alert.open({ message: "Successfully downloaded counts and saved into local storage"})
        state.success();
        $scope.entityCountSet = true;
      }, function(){
        state.fatal("Error while downloading counts, check URL");
      });
    };

    function downloadOntology(){
      var state = StateHandler.getInstance();
      state.initiate();

      $scope.cFactory.$download()
      .then(function(){
        $scope.cFactory.$save();
      })
      .then(function(r){
        $Alert.open({ message: "Successfully downloaded ontology and saved into local storage"})
        state.success();
      }, function(){
        state.fatal("Error while loading ontology");
      });
    };

    init();
  }]);

}());
