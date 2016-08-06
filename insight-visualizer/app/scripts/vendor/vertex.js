gViz.Vertex = (function(behavior){

  function Vertex(graph, element){
    // element refers to the entity that the vertex represents.
    if(element instanceof Object){
      this[behavior.vertextIdentifier] = element[behavior.vertextIdentifier];
      this.loaded = true;
    } else {
      this[behavior.vertextIdentifier] = element;
      this.loaded = false;
    };

    this.source = element;
    this.graph = graph;

    this.isVertex = true;

    graph.addClassToCanvas(this.groupIdentifier());
  };

  var self = Vertex;

  // If vertex isn't part of the graph, create a new vertex and add it
  // to the graph.
  self.load = function(graph, element){
    var v = find(graph, element);
    if(!v){
      v = new self(graph, element);
      add(graph, v);
    } else {
      // If the vertex is present in the graph and is unloaded
      // refresh the source and update the loading status
      if(!v.loaded && element instanceof Object){
        v.source = element;
        v.loaded = true;
      };
    };

    return v;
  };

  // Checks if the element is a vertex
  self.isVertex = function(element){
    if(element instanceof Object){
      return !(element['in'] && element['out']) && element[behavior.vertextIdentifier];
    };

    return false;
  };


  // Private Methods

  // Adds the vertex to the graph if the vertex isn't already present
  var add = function(graph, v){
    if(!find(graph, v)){
      graph.nodes.push(v);
      put(graph, v[behavior.vertextIdentifier], v);
    };
  };

  var find = function(graph, element){
    return get(graph, identifier(element));
  };

  var get = function(graph, k){
    return graph.vertices[k];
  };

  var put = function(graph, k, v){
    graph.vertices[k] = v;
  };

  var validVertex = function(value){
    if(!val) return false;
    if(typeof val == 'string') return true;
    if(typeof val == 'object' && checkInput(val[behavior.vertextIdentifier])) return true;
    return false;
  };

  var identifier = function(element){
    return (element instanceof Object) ? element[behavior.vertextIdentifier] : element;
  };


  // Instance Methods
  // Returns the vertex's unique identifier
  self.prototype.identifier = function(){
    return identifier(this);
  };

  // Remove vertex and associated edges from store
  self.prototype.remove = function(){
    this.graph.nodes.splice(this.graph.nodes.indexOf(this), 1);
    var toSplice = this.graph.links.filter(function(l){
      return (l.source === this || l.target === this);
    }.bind(this));
    toSplice.map(function(l){
      this.graph.links.splice(this.graph.links.indexOf(l), 1);
    }.bind(this));
    delete this.graph.vertices[identifier(this)];
  };

  // Group identifier
  self.prototype.groupIdentifier = function(){
    return (this.source[behavior.typeIdentifier] || behavior.defaultType);
  };

  // To JSON to display
  self.prototype.toJSON = function(){
    var res = {};
    res["Id"] = this.identifier();
    res["Name"] = this.source.name;
    res["Type"] = this.groupIdentifier();
    res["Loaded"] = this.loaded;

    // FIX THIS
    res["Alias"] = this.source.alias;
    return res;
  };


  return Vertex;

}(gViz.getBehavior()));
