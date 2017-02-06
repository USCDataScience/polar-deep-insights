angular.module("polar.data")

.factory("polar.data.Concept", ["$resource", "$q",
  function($resource, $q){

    function Concept(c){
      var mkId = function(name){
        return name.toLocaleLowerCase().split(" ").join("-");
      };
      angular.extend(this, c);
      this.id        = mkId(c.name);
      this.isConcept = true;
      this.isVertex  = true;

      if(!this.type){
        this.type = "concept";
      };
    };


    Concept.load = function(c){
      return _.map(c, function(cc){ return new Concept(cc) });
    };

    Concept.prototype.getNames = function(){

      var m = [ ];

      m.push(this.name.toLocaleLowerCase());

      _.each(this.alias, function(a){
        m.push( a.text.toLocaleLowerCase() );
      });

      return m;

    };

    return Concept;
  }
]);
