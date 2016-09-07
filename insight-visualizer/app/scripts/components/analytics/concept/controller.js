(function(){

  var app = angular.module("polar.components.analytics.concept");
  app.controller("polar.components.analytics.concept.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler", "polar.data.ConceptFactory","polar.data.EntityCount",
  function ($scope, Document, $FilterParser, StateHandler, ConceptFactory, EntityCount){

    function init(){
      $scope.state = StateHandler.getInstance(false, true);
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
      Document.aggregateByConcepts(fS, $scope.field).then(function(d){
        $scope.entitiyCount     = EntityCount.parsedEntityList();
        var totalMatchedDocs    = d.hits.total;
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
        var p = _.chain(d.aggregations.entities.entity_name.buckets)
                 .map(function(d){
                    var c = $scope.store.matchConcept(d.key);
                    if($scope.field == 'tf-idf'){
                      var idf = Math.log(1 + totalMatchedDocs / (d.doc_count) );
                      var tf = 1 + Math.log( d.entity_stats[$scope.fn] );
                      c.value = tf * idf;
                    } else{
                      c.value = d.entity_stats[$scope.fn];
                    };
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
        });

        // p = p.concat($scope.store.metaConcepts());

        p = _.unique(p, function(c){
          return c.id;
        });

        var nodeIndex = _.reduce(p, function(m,n,i){ m[n.id] = i; return m }, { });

        var edges = _.chain($scope.store.getRelations(p)).map(function(r){
          r.target = nodeIndex[r.in];
          r.source = nodeIndex[r.out];
          r.value = 1;
          return r;
        }).filter(function(e){
          return e.source && e.target;
        })
        .value();

        var nodes = _.map(p, function(n){
          return {
            id: n.id,
            group: 1
          };
        });

        $scope.gData = {
          nodes: nodes,
          links: edges,
        };

        $scope.state.success();

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
