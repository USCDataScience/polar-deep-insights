angular.module("polar.data")

.factory("polar.data.EntityCount", ["$resource", "$q", "$http", "polar.data.Config", "polar.data.ConceptFactory",
  function($resource, $q, $http, Config, ConceptFactory){
    // TODO remove hardcoded list
    var ENTITIES = ["entities", "dates", "time", "places", "organizations", "percentages", "money", "people", "locations"];

    var EntityCount = function(d){
      _.each(_.keys(d), function(k){
        this[k] = angular.copy(d[k]);
      });
    };

    EntityCount.fetchEntites = function(){
      var types = ["places", "organizations", "people", "time", "money", "percentages"]

      var extractType = function(type){
        return _.chain(EntityCount.data[type])
          .map(function(v, k){ return { name: k, type: type, count: v }; })
          .sortBy(function(d){ return -d.count })
          .value();
      };

      return _.chain(types)
       .reduce(function(m, t){ m[t] = extractType(t); return m; }, { })
       .value();
    };

    EntityCount.parsedEntityList = function(){
      var store = ConceptFactory.getInstance();
      return _.reduce(EntityCount.data["entities"], function(m, v, k){
        var c = store.matchConcept(k).id;
        if(!m[c]){
          m[c] = 0
        };
        m[c] = m[c] + v;
        return m;
      }, { })
    };

    EntityCount.isSet = function(){
      return !_.isEmpty(EntityCount.data) && _.keys(EntityCount.data).length == ENTITIES.length;
    };

    EntityCount.download = function(d){
      var deferred = $q.defer();
      $http.get(Config.data.entityCountPath).then(function(d){
        EntityCount.data = d.data;
        deferred.resolve( new EntityCount(EntityCount.data) );
      },function(){
        deferred.reject();
      });
      return deferred.promise;
    };

    EntityCount.fetch = function(d){
      var deferred = $q.defer();
      if(!EntityCount.isSet()){
        $http.get(Config.data.entityCountPath).then(function(d){
          EntityCount.data = d.data;
          deferred.resolve( new EntityCount(EntityCount.data) );
        },function(){
          deferred.reject();
        });
      } else {
        var eC = EntityCount.data;
        deferred.resolve( new EntityCount(eC) );
      };
      return deferred.promise;
    };

    return EntityCount;
  }
]);
