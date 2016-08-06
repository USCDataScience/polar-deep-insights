angular.module("tg.graph")

.factory('Visualizer', function(){
  var Visualizer = gViz;

  Visualizer.setup({
    defaultType: "Unknown",
    vertextIdentifier: "id",
    typeIdentifier: "type"
  });

  Visualizer.configure({
    "classes": {
      "Simple": {
        "display" : "name"
      },
      "Derived": {
        "display" : "name"
      },
      "Group": {
        "display" : "name"
      }
    }
  });

  return Visualizer;
});
