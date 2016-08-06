(function(){

  var app = angular.module("polar.components.filter.concept");
  app.controller("polar.components.filter.concept.Controller",
  [ "$scope",  "polar.data.ConceptFactory", "tg.graph.aside.$aside", function ($scope, ConceptFactory, Aside){

    /*
    In the context of this controller factory refers to this filter graph
    Store refers to the stored concept graph
    */
    function init(){
      $scope.store   = ConceptFactory.getInstance();

      if(!$scope.filter.factory){
        $scope.filter.factory = new ConceptFactory($scope.filter.concepts, $scope.filter.relations);
      };

      $scope.factory = $scope.filter.factory;
    };


    $scope.onGraphLoad = function(graph){
      $scope.graph = graph;

      $scope.graph.on('node/click', function (v){
        Aside.refresh(v);
      });

      $scope.graph.on('edge/click', function (e){
        Aside.refresh(e);
      });

      $scope.graph.on('node/dblclick', function(v){
        if(!v.loaded){
          var c = $scope.store.getConceptById(v.id);
          $scope.factory.concepts.push(c);
          redraw();
        };
      });

      $scope.graph.on('node/load', function (v, callback){
        console.log("node/load")
      });

      init();
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
        name: "\uf014",
        placeholder: "Delete vertex",
        onClick: function(v, label){
          $scope.removeConcept(v, v.id);
        }
      },{
        name: "\uf077",
        placeholder: "Load Parent",
        onClick: function(v){
          $scope.loadParentEdges(v.id);
        }
      },{
        name: "\uf06e",
        placeholder: "Inspect",
        onClick: function(v){
          // INSPECT VERTEX
          Aside.open(v);
        }
      },{
        name: "\uf078",
        placeholder: "Load Children",
        onClick: function(v){
          $scope.loadChildrenEdges(v.id);
        }
      }
    ];

    function redraw(){
      $scope.stream = $scope.factory.getStream();
      $scope.graph.clear();
      $scope.graph.data($scope.stream).redraw();
    };


    $scope.removeConcept = function(v, id){
      $scope.graph.removeVertex(v);
      $scope.factory.removeConcept(id);
    };

    $scope.removeRelation = function(e, id){
      $scope.factory.removeRelation(id);
      $scope.graph.removeEdge(e);
    };

    $scope.helpers = { };

    $scope.helpers.onConceptAdd = function(cNames){
      var concepts = _.map(cNames, function(c){ return $scope.store.matchConcept(c.text); });
      $scope.factory.concepts = $scope.factory.concepts.concat(concepts);
      $scope.graph.data( concepts ).redraw();
    };

    $scope.loadParentEdges = function(id){
      var newR = _.filter($scope.store.relations, function(r){ return r.out == id });
      var oldR = $scope.factory.relations;
      $scope.factory.relations = _.uniq( oldR.concat( newR ) );
      $scope.graph.data( _.difference(newR, oldR) ).redraw();
    };

    $scope.loadChildrenEdges = function(id){
      var newR = _.filter($scope.store.relations, function(r){ return r.in == id });
      var oldR = $scope.factory.relations;
      $scope.factory.relations = _.uniq( oldR.concat( newR ) );
      $scope.graph.data( _.difference(newR, oldR) ).redraw();
    };

  }]);

}());
