angular.module("polar.data")

.factory("polar.data.Document", ["$resource", "$q", "polar.util.services.$ElasticSearch", "polar.data.Config",
  function($resource, $q, $ES, Config){
    function Document(c){ };

    Document.generateQueryObject = function(filters){
      var geoQuery = function(filter){
        var regionFilters = _.map(filter.data, function(c){
          function parseLat(lat){
            if(lat <= 90 && lat >= -90){
              return lat;
            } else if(lat > 90){
              return (90 - lat);
            } else {
              return (-90 - lat);
            };
          };

          function parseLon(lon){
            if(lon <= 180 && lon >= -180){
              return lon;
            } else if(lon > 180){
              return (180 - lon);
            } else {
              return (-180 - lon);
            };
          };
          return {
            "geo_bounding_box" : {
              "geo" : {
                "top_left" : {
                  "lat": parseLat(c[0].lat),
                  "lon": parseLon(c[0].lng),
                },
                "bottom_right" : {
                  "lat": parseLat(c[1].lat),
                  "lon": parseLon(c[1].lng),
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

      var entityQuery = function(filter){
        var entityByTypes = _.groupBy(filter.entities, function(e){ return e.type; });


        var genQuery = function(type, values){
          var entityFilters = _.map(values, function(v){
            var d = {
              "match" : { }
            };
            d.match[type + ".name.raw"] = v.name;
            return d;
          });

          return {
            "nested": {
              "path": type,
              "query":{
                "bool": {
                  "should": entityFilters
                }
              }
            }
          };

        };

        return _.map(entityByTypes, function(v, k){
          return genQuery(k, v);
        });
      };

      var measurementQuery = function(filter){
        var measurementFilters = _.map(filter.measurements, function(m){
          return {
            "match" : {
              "measurements.rawUnit-name.raw": m.name
            }
          };
        });

        return {
          "nested": {
            "path": "measurements",
            "query":{
              "bool": {
                "should": measurementFilters
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
        } else if(f.type == "measurement"){
          return measurementQuery(f);
        } else if(f.type == "entity"){
          return entityQuery(f);
        };
      });

      return _.flatten(queries);
    };

    Document.query = function(filters, agg){
      var c = Config.getData();
      var es = new $ES(c.endpoint, c.index, c.docType);

      if(filters.length == 0){
        return es.search(null, agg);
      };

      return es.search({
        "bool" : {
          "must" : Document.generateQueryObject(filters)
        }
      }, agg);
    };

    Document.aggregateStats = function(filters){
      return Document.query(filters, {
        "datesOC": {
          "stats": {
            "field": "dates-occuranceCount"
          }
        },
        "datesTC": {
          "stats": {
            "field": "dates-typeCount"
          }
        },

        "entitiesOC": {
          "stats": {
            "field": "entities-occuranceCount"
          }
        },
        "entitiesTC": {
          "stats": {
            "field": "entities-typeCount"
          }
        },

        "locationsOC": {
          "stats": {
            "field": "locations-occuranceCount"
          }
        },
        "locationsTC": {
          "stats": {
            "field": "locations-typeCount"
          }
        },

        "moneyOC": {
          "stats": {
            "field": "money-occuranceCount"
          }
        },
        "moneyTC": {
          "stats": {
            "field": "money-typeCount"
          }
        },

        "organizationsOC": {
          "stats": {
            "field": "organizations-occuranceCount"
          }
        },
        "organizationsTC": {
          "stats": {
            "field": "organizations-typeCount"
          }
        },

        "peopleOC": {
          "stats": {
            "field": "people-occuranceCount"
          }
        },
        "peopleTC": {
          "stats": {
            "field": "people-typeCount"
          }
        },

        "percentagesOC": {
          "stats": {
            "field": "percentages-occuranceCount"
          }
        },
        "percentagesTC": {
          "stats": {
            "field": "percentages-typeCount"
          }
        },

        "placesOC": {
          "stats": {
            "field": "places-occuranceCount"
          }
        },
        "placesTC": {
          "stats": {
            "field": "places-typeCount"
          }
        },

        "timeOC": {
          "stats": {
            "field": "time-occuranceCount"
          }
        },
        "timeTC": {
          "stats": {
            "field": "time-typeCount"
          }
        },
      });
    };

    Document.aggregateByDates = function(filters, field){
      var agg = { };

      if(field == 'tf-idf'){
        field='count';
      };

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
                 "entity_stats": {
                    "stats" : {
                      "field": "dates." + ( field || "count" )
                    }
                 }
               }
             }
           }
        }
      });
    };

    Document.aggregateByEntity = function(filters, type, field){
      if(field == 'tf-idf'){
        field='count';
      };

      return Document.query(filters, {
        "entities": {
           "nested": {
             "path": ( type || "places" )
           },
           "aggs": {
             "entity_name": {
               "terms": {
                 "field": ( type || "places" ) + ".name.raw",
                 "size": 1000
               },
               "aggs": {
                 "entity_stats": {
                   "stats": {
                     "field": ( type || "places" ) +"."+ ( field || "count" )
                   }
                 }
               }
             }
           }
        },
        "entity_count" : { "sum" : { "field" : "entities-occuranceCount" } }
      });
    };

    Document.aggregateByConcepts = function(filters, field){
      if(field == 'tf-idf'){
        field='count';
      };

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
                 "entity_stats": {
                   "stats": {
                     "field": "entities." + ( field || "count" )
                   }
                 }
               }
             }
           }
        },
        "entity_count" : { "sum" : { "field" : "entities-occuranceCount" } }
      });
    };

    Document.aggregateByMeasurements = function(filters){
      return Document.query(filters, {
        "entities": {
          "nested": {
            "path": "measurements"
          },
          "aggs": {
            "entity_name": {
              "terms": {
                "field": "measurements.rawUnit-name.raw",
                "size": 1000
              },
              "aggs" : {
                "entity_stats" : {
                    "stats" : {
                      "field" : "measurements.parsedValue"
                    }
                }
              }
            }
          }
        }
      });
    };

    Document.aggregateByRawMeasurements = function(filters, size){
      return Document.query(filters, {
        "entities": {
          "nested": {
            "path": "measurements"
          },
          "aggs": {
            "entity_name": {
              "terms": {
                "field": "measurements.rawUnit-name.raw",
                "size": ( size || 1000 )
              }
            }
          }
        }
      });
    };

    Document.aggregateByLocations = function(filters, field){
      if(field == 'tf-idf'){
        field='count';
      };

      return Document.query(filters, {
        "entities": {
          "nested": {
            "path": "locations"
          },
          "aggs": {
            "entity_name": {
              "terms": {
                "field": "locations.name.raw",
                "size": 1000
              },
              "aggs": {
                "lat": {
                  "max": {
                    "field": "locations.location.lat"
                  }
                },
                "lon": {
                  "max": {
                    "field": "locations.location.lon"
                  }
                },
                "entity_stats": {
                  "stats" : {
                    "field": "locations." + ( field || "count" )
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
