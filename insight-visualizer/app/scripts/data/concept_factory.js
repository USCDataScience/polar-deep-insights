angular.module("polar.data")

.factory("polar.data.ConceptFactory", ["$resource", "$http", "$q", "polar.data.Concept", "polar.data.Relation", "localStorageService", "polar.util.services.$ElasticSearch", "polar.data.Config",
  function($resource, $http, $q, Concept, Relation, localStorageService, $ES, Config){
    function ConceptFactory(c, r){
      this.concepts  = Concept.load(c)  || [ ];
      this.relations = Relation.load(r) || [ ];
    };

    ConceptFactory.prototype.getConceptById = function(id){
      return _.find(this.concepts, function(c){ return c.id == id });
    };

    ConceptFactory.prototype.getConceptByIds = function(ids){
      return _.filter(this.concepts, function(c){ return _.include(ids, c.id) });
    };

    ConceptFactory.prototype.getConceptNames = function(){
      return _.chain(this.concepts)
      .reduce(function(m, c){
        return m.concat( c.getNames() );
      }, [ ])
      .sortBy(function(n){
        return -1 * n.split(" ").length;
      })
      .value();
    };

    ConceptFactory.prototype.getRelations = function(concepts){
      var cIds = _.pluck(concepts, "id");
      return _.filter(this.relations, function(r){
        return _.contains(cIds, r.out);
      })
    };

    ConceptFactory.prototype.matchConcept = function(n){
      return _.find(this.concepts, function(c){
        aliasNameMatch = _.find(c.alias || [], function(a){ return a.text.toLocaleLowerCase() == n; });
        return c.name.toLocaleLowerCase() == n || aliasNameMatch;
      })
    };

    ConceptFactory.prototype.addConcept = function(c){
      var newC = new Concept(c);
      this.concepts.push(newC);
      return newC;
    };

    ConceptFactory.prototype.removeConcept = function(id){
      this.concepts = _.filter(this.concepts, function(c){ return c.id != id; });
    };

    ConceptFactory.prototype.updateConcept = function(c){
      this.removeConcept(c.id);
      return this.addConcept(c);
    };

    ConceptFactory.prototype.addRelation = function(t, c1, c2){
      this.relations.push(new Relation(t, c1.id, c2.id));
    };

    ConceptFactory.prototype.removeRelation = function(id){
      this.relations = _.filter(this.relations, function(r){ return (r.in != id.split("_")[1] && r.out != id.split("_")[0]) });
    };

    ConceptFactory.prototype.getStream = function(){
      return this.concepts.concat(this.relations);
    };

    ConceptFactory.prototype.$save = function(){
      var deferred = $q.defer();
      localStorageService.set('data', this);
      deferred.resolve();
      return deferred.promise;
    };

    ConceptFactory.prototype.$upload = function(){
      var deferred = $q.defer();

      var c = Config.getData();
      new $ES(c.endpoint).instance.create({
        index: c.ontologyIndex,
        type: c.ontologyDocType,
        id: parseInt(Date.now() / 1000),
        body: this
      }).then(function(){
        deferred.resolve();
      }, function(){
        deferred.reject();
      });

      return deferred.promise;
    };


    ConceptFactory.prototype.$download = function(){
      var deferred = $q.defer(),
          self = this;

      var c = Config.getData();
      $http.get(c.sweetOntologyPath).then(function(d){
        self.concepts = d.data.concepts;
        self.relations = d.data.relations;
        deferred.resolve();
      },function(){
        deferred.reject();
      });

      return deferred.promise;

    };

    ConceptFactory.prototype.metaConcepts = function(){
      return _.filter(this.concepts, function(c){ return c.type == "meta" });
    };

    ConceptFactory.getInstance = function(){
      var d = localStorageService.get('data');
      if(d){
        return new ConceptFactory(d.concepts, d.relations);
      } else {
        return new ConceptFactory();
      };
    };

    ConceptFactory.isSet = function(){
      return !_.isEmpty( localStorageService.get('data') );
    };

    return ConceptFactory;
  }
]);
