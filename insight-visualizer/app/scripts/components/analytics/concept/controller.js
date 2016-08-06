(function(){

  var app = angular.module("polar.components.analytics.concept");
  app.controller("polar.components.analytics.concept.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler", "polar.data.ConceptFactory",
  function ($scope, Document, $FilterParser, StateHandler, ConceptFactory){

    $scope.onGraphLoad = function(graph){
      $scope.graph = graph;

      $scope.graph.on('node/click', function (v){
        Aside.refresh(v);
      });

      $scope.graph.on('edge/click', function (e){
        Aside.refresh(e);
      });

      $scope.graph.on('node/dblclick', function(v){
        console.log("node/dblclick")
      });

      $scope.graph.on('node/load', function (v, callback){
        console.log("node/load")
      });

      init();
    };

    $scope.edgeMenu = [
      {
        name: '\uf06e',
        placeholder: "Inspect",
        onClick: function (e) {
          Aside.open(e);
        }
      }
    ];

    $scope.nodeMenu = [
      {
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

    function init(){
      $scope.state = StateHandler.getInstance();
      $scope.store = ConceptFactory.getInstance();
      loadData();
    };

    function normalizeSizes(objs){
      var maxCount = _.max(objs, function(t){ return t.oCount; }).oCount,
          nObjs;

      nObjs = _.map(objs, function(t){
        t.size = (t.oCount / maxCount) * 100;
        return t;
      });

      return nObjs;
    };

    function loadData(){
      $scope.state.initiate();
      var fS = $FilterParser($scope.filters);
      Document.aggregateByConcepts(fS).then(function(d){
        var selectedIds = _.chain(fS)
                           .filter(function(f){ return f.type == "concept" })
                           .pluck("data")
                           .flatten()
                           .map(function(c){
                            return $scope.store.matchConcept(c);
                           })
                           .pluck("id")
                           .uniq()
                           .value();

        var r = _.chain(d.aggregations.entities.entity_name.buckets)
                 .map(function(d){
                    var c = $scope.store.matchConcept(d.key)
                    return {
                      text: c.id,
                      dCount: d.doc_count,
                      oCount: d.entity_count.value,
                    }
                 })
                 .groupBy(function(d){
                  return d.text;
                 })
                 .reduce(function(m, d){

                  var comb = _.reduce(d, function(m, x){
                    m.dCount = m.dCount + x.dCount;
                    m.oCount = m.oCount + x.oCount;
                    m.text = x.text;
                    return m;
                  }, { dCount: 0, oCount: 0 });

                  m.push(comb);

                  return m;

                 }, [ ])
                 .filter(function(d){
                  return !_.contains(selectedIds, d.text)
                 })
                 .value();

        var p = _.chain(d.aggregations.entities.entity_name.buckets)
                 .map(function(d){
                    var c = $scope.store.matchConcept(d.key);
                    c.dCount = d.doc_count
                    c.oCount = d.entity_count.value
                    return c;
                 })
                 .filter(function(d){
                    return !_.contains(selectedIds, d.id)
                 })
                 .value();

        $scope.factory = new ConceptFactory(p, $scope.store.getRelations(p));
        $scope.state.success();

        redraw();

        $scope.tags = normalizeSizes(r);

      }, function(){
        $scope.state.fatal();
      });
    };

    $scope.$on('polar.components.analytics.reloadData.Concept', function(e){
      loadData();
    });

  }]);

}());
