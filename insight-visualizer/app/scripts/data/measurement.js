angular.module("polar.data")

.factory("polar.data.Measurement", ["$resource", "$q", "polar.util.services.$ElasticSearch",
  "polar.data.Document", "localStorageService", "polar.data.Config",
  function($resource, $q, $ES, Document, localStorageService, Config){
    function Measurement(){ };

    Measurement.fetchDistribution = function(unit, filters){
      var queries = Document.generateQueryObject(filters);
      var c = Config.getData();

      queries.push({
        "nested": {
          "path": "measurements",
          "query":{
            "bool": {
              "should": [{
                "match" : {
                  "measurements.rawUnit-name.raw": unit
                }
              }]
            }
          },
          "inner_hits" : {}
        }
      });

      return new $ES(c.endpoint, c.index, c.docType).paginate({
        "bool" : {
          "must" : queries
        }
      });
    };

    Measurement.fetchRawMeasurements = function(){
      var m = localStorageService.get('measurements') || [ ];

      if(m.length > 0){
        var deferred = $q.defer();
        deferred.resolve(m);
        return deferred.promise;
      } else {
        return Document.aggregateByRawMeasurements([ ], 400).then(function(d){
          var measurements = _.chain(d.aggregations.entities.entity_name.buckets)
                                .map(function(m){
                                  return { name : m.key, count: m.doc_count }
                                })
                                .value();

          return measurements;
        });
      };
    };

    Measurement.persistRawMeasurements = function(m){
      localStorageService.set('measurements', m);
    };

    return Measurement;
  }
]);
