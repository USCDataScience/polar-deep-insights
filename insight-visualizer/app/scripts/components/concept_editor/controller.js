(function(){

  var app = angular.module("polar.components.conceptEditor");
  app.controller("polar.components.conceptEditor.Controller",[
    "$scope", "$timeout", "tg.graph.aside.$aside",
    "polar.components.conceptEditor.concept.$Modal", "polar.data.ConceptFactory",
    "polar.util.services.$Alert", "polar.util.services.$Dialog",
    "polar.components.conceptEditor.export.$Modal",
    "polar.util.services.StateHandler",
    function ($scope, $timeout, Aside, $ConceptModal, ConceptFactory, $Alert, $Dialog, $ExportModal, StateHandler) {

    $scope.onGraphLoad = function(graph) {
      $scope.graph = graph;

      $scope.graph.on('node/click', function (v) {
        Aside.refresh(v);
      });

      $scope.graph.on('edge/create', function (v1, v2) {
        $scope.addRelation("refers", v1, v2);
      });

      $scope.graph.on('edge/click', function (e) {
        Aside.refresh(e);
      });

      $scope.graph.on('node/dblclick', function (v) {
        console.log("node/dblclick")
      });

      $scope.graph.on('node/load', function (v, callback) {
        console.log("node/load")
      });

      $scope.state = StateHandler.getInstance();

      redraw();
    };

    $scope.edgeMenu = [
      {
        name: '\uf06e',
        placeholder: "Inspect",
        onClick: function (e) {
          Aside.open(e);
        }
      },{
        name: '\uf127',
        placeholder: "Remove edge",
        onClick: function (e){
          $scope.removeRelation(e, e.id);
        }
      }
    ];

    $scope.nodeMenu = [
      {
        name: '\uf044',
        onClick: function(v){
          $scope.editConcept(v, v.source);
        }
      },{
        name: "\uf014",
        placeholder: "Delete vertex",
        onClick: function(v, label){
          $scope.removeConcept(v, v.id);
        }
      },{
        name: "\uf0c1",
        placeholder: "Connect",
        onClick: function(v){
          $scope.graph.startEdge();
        }
      },{
        name: "\uf06e",
        placeholder: "Inspect",
        onClick: function(v){
          // INSPECT VERTEX
          Aside.open(v);
        }
      }
    ];

    $scope.metadata = {};
    $scope.configration = {};
    $scope.behavior = {};

    $scope.factory = ConceptFactory.getInstance();

    function redraw(){
      $scope.stream = $scope.factory.getStream();
      $scope.graph.clear();
      $scope.graph.data($scope.stream).redraw();
    };


    $scope.addConcept = function(){
      $ConceptModal.open({ }).then(function(c){
        $scope.graph.data([ $scope.factory.addConcept(c) ]).redraw();
      });
    };

    $scope.editConcept = function(v, concept){
      $ConceptModal.open(concept).then(function(c){
        // $scope.graph.removeVertex(v);
        $scope.graph.data([ $scope.factory.updateConcept(c) ]).redraw();
      });
    };

    $scope.removeConcept = function(v, id){
      $scope.graph.removeVertex(v);
      $scope.factory.removeConcept(id);
    };

    $scope.addRelation = function(t, c1, c2){
      $scope.factory.addRelation(t, c1, c2);
      $scope.graph.data([{ "out": c1.identifier(), "in": c2.identifier(), type: "refers" }]).redraw();
      $scope.$apply(function(){
        $scope.graph.endEdgeCreation();
      });
    };

    $scope.removeRelation = function(e, id){
      $scope.factory.removeRelation(id);
      $scope.graph.removeEdge(e);
    };

    $scope.saveLocally = function(){
      $scope.factory.$save();
      $Alert.open({ message: "Concept graph successfully saved in local storage"})
    };

    $scope.export = function(){
      $ExportModal.open($scope.factory)
    };

    $scope.upload = function(){
      $scope.state.initiate();
      $scope.factory.$upload().then(function(){
        $scope.state.success("Successfully uploaded ontology");
      }, function(){
        $scope.state.fatal("Error while saving ontology");
      })
    };

    $scope.download = function(){
      $scope.state.initiate();
      $scope.factory.$download().then(function(r){
        redraw();
        $scope.state.success();
      }, function(){
        $scope.state.fatal("Error while loading ontology");
      });
    };

  }]);

}());
