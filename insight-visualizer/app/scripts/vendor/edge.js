gViz.Edge = (function(behavior, Vertex){
  function Edge(graph, v1, v2, edge){
    this.graph = graph;
    this.source = v1;
    this.target = v2;
    this.id = makeId(this.source, this.target);
    this.left = false;
    this.right = true;
    this.edge = edge;
    this.label = this.groupIdentifier();
    this.isEdge = true;
  };

  var self = Edge;

  self.load = function(graph, edge){
    var v1 = Vertex.load(graph, edge['out']);
    var v2 = Vertex.load(graph, edge['in']);
    var e = new Edge(graph, v1, v2, edge);
    e.add(e);
    return e;
  };

  // Checks if the element is an edge
  self.isEdge = function(element){
    return (element['out'] && element['in']);
  };

  // Public Methods
  var makeId = function(v1, v2){
    return v1.identifier() + "_" + v2.identifier();
  };

  // Instance Methods
  // Adds edge to graph store
  self.prototype.add = function(){
    var count = this.graph.edges[this.id];
    if(!count){
      this.graph.edges[this.id] = [];
    };
    var found = false;
    this.graph.edges[this.id].forEach(function(e1){
      if(e1.source == this.source && e1.target == this.target){
        found = true;
      }
    });
    if(!found){
      this.graph.edges[this.id].push(this);
      this.graph.links.push(this);
    }
  };

  // Remove edge from store
  self.prototype.remove = function(){
    this.graph.links.splice(this.graph.links.indexOf(this), 1);
  };

  // Returns the count of all edges between two nodes connected by
  // the given edge in the same direction
  self.prototype.similarCount = function(){
    return this.graph.edges[this.id] ? this.graph.edges[this.id].length : 0;
  };

  // Returns the total count of all edges between two nodes
  // connected by the given edge
  self.prototype.totalCount = function(){
    var oEdges = this.graph.edges[makeId(this.target, this.source)];
    return this.similarCount() + oEdges ? oEdges.length : 0;
  };

  // Returns the index of the current edge in the collections of
  // redundant edges.
  self.prototype.indexInSimilar = function(){
    return this.graph.edges[this.id].indexOf(this);
  };

  // Group identifier
  self.prototype.groupIdentifier = function(){
    return this.edge ? this.edge[behavior.typeIdentifier] : behavior.defaultType;
  };

  // To JSON to display
  self.prototype.toJSON = function(){
    var res = {};
    res["Id"] = this.id;
    res["Type"] = this.groupIdentifier();
    res["Source-Id"] = this.source.identifier();
    res["Source-Name"] = this.source.source.name;
    res["Source-Type"] = this.source.groupIdentifier();
    res["Target-Id"] = this.source.identifier();
    res["Target-Name"] = this.target.source.name;
    res["Target-Type"] = this.target.groupIdentifier();
    return res;
  };

  // Label to display
  self.prototype.labelToDisplay = function(){
    if(!behavior.hideLabel){
      return this.label;
    }
  };

  return Edge;

}(gViz.getBehavior(), gViz.Vertex));
