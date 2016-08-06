angular.module("polar.data")

.factory("polar.data.Document", ["$resource", "$q", "polar.util.services.$ElasticSearch",
  function($resource, $q, $ES){

    var es = new $ES();

    function Document(c){ };

    Document.generateQueryObject = function(filters){

      var geoQuery = function(filter){
        var regionFilters = _.map(filter.data, function(c){
          return {
            "geo_bounding_box" : {
              "locations" : {
                "top_left" : {
                  "lat": c[0].lat,
                  "lon": c[0].lng,
                },
                "bottom_right" : {
                  "lat": c[1].lat,
                  "lon": c[1].lng,
                }
              }
            }
          };
        });

        return {
          "bool": {
            "should": regionFilters
          }
        };
      };

      var dateQuery = function(filter){
        var dateFilters = _.map(filter.data, function(r){
          return {
            "range" : {
              "dates.name" : {
                "gte" : r.min,
                "lte" : r.max
              }
            }
          }
        });

        return {
          "nested": {
            "path": "dates",
            "query": {
              "bool": {
                "should": dateFilters
              }
            }
          }
        };
      };

      var conceptQuery = function(filter){
        var conceptFilters = _.map(filter.data, function(c){
          return {
            "match" : {
              "entities.name.raw": c
            }
          };
        });

        return {
          "nested": {
            "path": "entities",
            "query":{
              "bool": {
                "should": conceptFilters
              }
            }
          }
        };
      };

      var queries = _.map(filters, function(f){
        if(f.type == "geo"){
          return geoQuery(f);
        } else if(f.type == "time"){
          return dateQuery(f);
        } else if(f.type == "concept"){
          return conceptQuery(f);
        };
      });

      return queries;
    };

    Document.query = function(filters, agg){
      if(filters.length == 0){
        return es.search(null, agg);
      };

      return es.search({
        "bool" : {
          "must" : Document.generateQueryObject(filters)
        }
      }, agg);
    };

    Document.aggregateByDates = function(filters){
      return Document.query(filters, {
        "entities": {
           "nested": {
             "path": "dates"
           },
           "aggs": {
             "entity_name": {
               "terms": {
                 "field": "dates.name",
                 "size": 1000
               },
               "aggs": {
                 "entity_count": {
                   "sum": {
                     "field": "dates.count"
                   }
                 }
               }
             }
           }
        }
      });
    };

    Document.aggregateByConcepts = function(filters){
      return Document.query(filters, {
        "entities": {
           "nested": {
             "path": "entities"
           },
           "aggs": {
             "entity_name": {
               "terms": {
                 "field": "entities.name.raw",
                 "size": 1000
               },
               "aggs": {
                 "entity_count": {
                   "sum": {
                     "field": "entities.count"
                   }
                 }
               }
             }
           }
        }
      });
    };

    Document.aggregateByMeasurements = function(filters){
      return Document.query(filters, {
        "entities": {
          "nested": {
            "path": "quantities.normalizedUnit"
          },
          "aggs": {
            "entity_name": {
              "terms": {
                "field": "quantities.normalizedUnit.name.raw",
                "size": 1000
              },
              "aggs" : {
                "entity_stats" : {
                    "stats" : {
                        "field" : "quantities.normalizedUnit.normalizedQuantity"
                    }
                }
              }
            }
          }
        }
      });
    };

    Document.aggregateByLocations = function(filters){
      return Document.query(filters, {
        "entities": {
          "nested": {
            "path": "geo"
          },
          "aggs": {
            "entity_name": {
              "terms": {
                "field": "geo.name.raw",
                "size": 1000
              },
              "aggs": {
                "lat": {
                  "max": {
                    "field": "geo.location.lat"
                  }
                },
                "lon": {
                  "max": {
                    "field": "geo.location.lon"
                  }
                }
              }
            }
          }
        }
      });
    };


    return Document;
  }
]);
