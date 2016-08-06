var gViz = (function(){

  var Viz = function(){ };

  Viz.merger = function(){
    return angular ? angular : $;
  };

  var behavior = {
    defaultType: "Unknown",
    vertextIdentifier: "@id",
    typeIdentifier: "@class",
  };

  var configration = {
    height: 500,
    width: 1100,
    classes: { },
    node: {
      r: 30
    },
    linkDistance: 160,
    charge: -1500,
    friction: 0.9,
    gravity: 0.1
  };

  Viz.setup = function(b){
    Viz.merger().extend(behavior, b);
  };

  Viz.configure = function(c){
    Viz.merger().extend(configration, c);
  };

  Viz.getBehavior = function(){
    return behavior;
  };

  Viz.getConfigration = function(){
    return configration;
  };

  return Viz;
}());
