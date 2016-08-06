angular.module("polar.data")

.factory("polar.data.Measurement", ["$resource", "$q", "polar.util.services.$ElasticSearch", "polar.data.Document",
  function($resource, $q, $ES, Document){

    var es = new $ES();

    function Measurement(){

    };


    Measurement.fetchDistribution = function(unit, filters){
      var queries = Document.generateQueryObject(filters);

      queries.push({
        "nested": {
          "path": "quantities.normalizedUnit",
          "query":{
            "bool": {
              "should": [{
                "match" : {
                  "quantities.normalizedUnit.name.raw": unit
                }
              }]
            }
          },
          "inner_hits" : {}
        }
      });

      return es.paginate({
        "bool" : {
          "must" : queries
        }
      });
    };

    return Measurement;
  }
]);
