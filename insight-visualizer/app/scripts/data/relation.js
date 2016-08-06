angular.module("polar.data")

.factory("polar.data.Relation", ["$resource", "$q",
  function($resource, $q){

    function Relation(type, c1Id, c2Id){
      this.type      = type || "refers";
      this.out       = c1Id;
      this.in        = c2Id;
      this.isRelation= true;
      this.isEdge    = true;
    };


    Relation.load = function(r){
      return _.map(r, function(rr){ return new Relation(rr.type, rr.out, rr.in) });
    };

    return Relation;
  }
]);
