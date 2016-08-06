(function(){

  angular.module("polar.components.filter")

  .service("polar.components.filter.$FilterParser", ["$q", function($q){

    return function(filters){

      var validFilters = _.chain(filters)
                          .filter(function(f){ return f.$valid })
                          .map(function(f){
                            if(f.type == "geo"){
                              f.data = _.map(f.regions, function(r){
                                // Top left, Bottom Right
                                return [ r.coords[1], r.coords[3] ]
                              });

                            };

                            if(f.type == "concept"){

                              f.data = _.reduce(f.factory.concepts, function(m, c){
                                return m.concat( c.getNames() );
                              }, [ ])

                            };

                            if(f.type == 'time'){
                              f.data = f.timeRanges;
                            };

                            return f;

                          })
                          .value();

      return validFilters;
    };

  }]);

}());
