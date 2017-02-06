(function(){

  var app = angular.module("polar.components.analytics.popularEntities");
  app.controller("polar.components.analytics.popularEntities.Controller",
  [ "$scope", "polar.data.Document", "polar.components.filter.$FilterParser", "polar.util.services.StateHandler",
  function ($scope, Document, $FilterParser, StateHandler){

    function init(){
      $scope.state = StateHandler.getInstance(false, true);
      loadData();
    };

    function loadData(){
      $scope.state.initiate();
      Document.aggregateByEntity($FilterParser($scope.filters), $scope.eType, $scope.field).then(function(d){
        var totalMatchedDocs    = d.hits.total;

        var p = _.chain(d.aggregations.entities.entity_name.buckets)
                 .map(function(d){
                    var c = { };
                    c.label = d.key;
                    if($scope.field == 'tf-idf'){
                      var idf = Math.log(1 + totalMatchedDocs / (d.doc_count) );
                      var tf = 1 + Math.log( d.entity_stats[$scope.fn] );
                      c.value = tf * idf;
                    } else{
                      c.value = d.entity_stats[$scope.fn];
                    };
                    return c;
                 })
                 .sortBy(function(c){
                    return -c.value;
                 })
                 .value()
                 .slice(0, 500);

        var filteredEntities = _.chain($scope.filters)
          .pluck("entities")
          .flatten()
          .filter(function(f){ return f.type == $scope.eType; })
          .pluck("name")
          .value();

        var filtered = _.filter(p, function(d){
          return _.contains(filteredEntities, d.label)
        });

        var extracted = _.filter(p, function(d){
          return !_.contains(filteredEntities, d.label)
        });

        $scope.data = [ ];

        if(filtered.length > 0){
          $scope.data.push({
            "key": "Filtered",
            "color": "#d62728",
            "values": filtered
          });
        };

        $scope.data.push({
          "key": "Extracted",
          "color": "#1f77b4",
          "values": extracted
        });

        $scope.state.success();
      }, function(){
        $scope.state.fatal();
      });
    };

    init();

    $scope.$on('polar.components.analytics.reloadData.PopularEntities', function(e){
      loadData();
    });

  }]);
}());
