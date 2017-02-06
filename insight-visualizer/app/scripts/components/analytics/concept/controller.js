(function(){

  var app = angular.module("polar.components.analytics.concept");
  app.controller("polar.components.analytics.concept.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler", "polar.data.ConceptFactory","$q",
  function ($scope, Document, $FilterParser, StateHandler, ConceptFactory, $q){

    function init(){
      $scope.state = StateHandler.getInstance(false, true);
      $scope.store = ConceptFactory.getInstance();
      $scope.factory = new ConceptFactory();
      $scope.nResults = 10;
      $scope.inferenceBound = 2;
      loadData();
    };

    var graphLoad = $q.defer();

    $scope.onGraphLoad = function(graph){
      $scope.graph = graph;
      graphLoad.resolve();
    };

    $scope.edgeMenu = [];
    $scope.nodeMenu = [];
    $scope.metadata = {};
    $scope.behavior = {};
    $scope.configration = {
      height: 780,
      width: $(".body-container").width(),
    };

    function redraw(){
      $scope.stream = $scope.factory.getStream();
      $scope.graph.clear();
      $scope.graph.data($scope.stream).redraw();
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
      Document.aggregateByConcepts(fS, $scope.field).then(function(d){
        var totalMatchedDocs    = d.hits.total;
        var selectedConcepts = _.chain(fS)
                           .filter(function(f){ return f.type == "concept" })
                           .pluck("data")
                           .flatten()
                           .map(function(c){
                            return $scope.store.matchConcept(c);
                           })
                           .value();

        var selectedIds  = _.chain(selectedConcepts)
                            .pluck("id")
                            .uniq()
                            .value();

        var p = _.chain(d.aggregations.entities.entity_name.buckets)
                 .map(function(d){
                    var c = $scope.store.matchConcept(d.key);

                    if(c){
                      if($scope.field == 'tf-idf'){
                        var idf = Math.log(1 + (d.doc_count/totalMatchedDocs));
                        var tf = 1 + Math.log( d.entity_stats[$scope.fn] );
                        c.value = tf * idf;
                      } else{
                        c.value = d.entity_stats[$scope.fn];
                      };
                    };

                    return c;
                 })
                 .filter(function(c){
                  return c;
                 })
                 .map(function(c){
                    return {
                      "id": c.id,
                      "label": c.id,
                      "value": c.value,
                    }
                 })
                 .sortBy(function(c){
                  return -c.value;
                 })
                 .value();

        var filtered = _.filter(p, function(d){
          return _.contains(selectedIds, d.label)
        });

        var extracted = _.filter(p, function(d){
          return !_.contains(selectedIds, d.label)
        })
        .slice(0, $scope.nResults);

        $scope.data = [
          {
            "key": "Filtered",
            "color": "#d62728",
            "values": filtered
          },
          {
            "key": "Extracted",
            "color": "#1f77b4",
            "values": extracted
          }
        ];

        $scope.factory.concepts  = $scope.store.getConceptByIds(_.pluck(extracted, "id"));
        var filtered = _.map($scope.store.getConceptByIds(_.pluck(filtered, "id")), function(c){
          c.type = "Filtered";
          return c;
        });
        $scope.factory.concepts = $scope.factory.concepts.concat(filtered);
        $scope.factory.relations = $scope.store.getRelations($scope.factory.concepts);

        graphLoad.promise.then(function(){
          redraw();
        });

        $scope.state.success();


        $scope.infered = _.chain($scope.factory.relations)
        .groupBy(function(e){
          return e.in;
        })
        .reduce(function(m,v,k){
          if(v.length >= $scope.inferenceBound){
            m[k] = v.length;
          };
          return m;
        }, {})
        .keys()
        .value();

        if($scope.api.api){
          $scope.api.api.clearElement();
          $scope.options.chart.height = ($scope.nResults * 25);
          $scope.api.api.refresh();
        };

      }, function(){
        $scope.state.fatal();
      });
    };

    $scope.$on('polar.components.analytics.reloadData.Concept', function(e){
      loadData();
    });

    init();

  }]);

}());
