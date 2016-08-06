gViz.EdgeMenu = (function(d3){
  function EdgeMenu(graph){
    var self = this;

    this.graph = graph;
    this.edgeContainer = graph.svg.append('svg:g').attr("class", "edgeMenu hide");

    var width = 40 * graph.edgeActions.length;
    this.tree = d3.layout.tree().size([width, 50]);

    var data = { name: "", children: graph.edgeActions, x: 0, y: 0, root: true}
    var nodes = this.tree.nodes(data);
    var links = this.tree.links(nodes);

    // Edges between nodes as a <path class="link" />
    var link =
      d3.svg.diagonal()
        .projection(function(d){
          return [d.y, d.x];
        });

    this.edgeContainer.selectAll("path.enode-link")
      .data(links)
      .enter()
      .append("svg:path")
      .attr("class", "enode-link")
      .attr("d", link);

    this.nodeGroup =
      this.edgeContainer.selectAll("g.enode")
        .data(nodes)
        .enter()
        .append("svg:g")
        .attr("class", "enode")
        .attr("transform", function(d){
          return "translate(" + d.y + "," + d.x + ")";
        });

    this.circle =
      this.nodeGroup.append("svg:circle")
        .attr("class", function(d){
          return d.root ? "enode-root" : "enode-child";
        })
        .attr("r", 15);

    this.texts =
      this.nodeGroup.append("svg:text")
        .attr("text-anchor", function(d){
          return d.children ? "end" : "start";
        })
        .attr("dy", 5)
        .attr("dx", 1)
        .text(function(d){
          return d.name;
        }).on("click", function(d){
          if (d.onClick){
            d3.event.stopPropagation();
            d.onClick(self.selectedEdge.d);
          }
        });
  };

  EdgeMenu.prototype.select = function(data){
    var self = this;
    var bb = data.elem.getBBox();
    self.selectedEdge = data;
    self.edgeContainer.attr("class", "edgeMenu")
    self.edgeContainer.datum({ bbox: bb, edge: data.d, elem: data.elem });
    self.refreshPosition();
    self.graph.menu.hide();
  };

  EdgeMenu.prototype.hide = function(){
    var self = this;
    self.edgeContainer.attr("class", "edgeMenu hide")
  };

  EdgeMenu.prototype.refreshPosition = function(){
    var self = this;
    self.edgeContainer.attr("transform",function(data){
      if(data){
        var d = data.edge;
        var bb = data.bbox;
        var deltaX = d.target.x - d.source.x;
        var m = (d.target.y - d.source.y) / (d.target.x - d.source.x);
        var x = (d.target.x + d.source.x) / 2;
        var y = (d.target.y + d.source.y) / 2;
        var val = (Math.atan(m) * 180) / Math.PI;
        val += 90 * (deltaX < 0 ? 1 : -1);
        self.texts.attr("transform", function(data){
          return 'rotate( ' + ( -val) + ')';
        })
        if (!isNaN(val)){
          var offsetX = -bb.width;
          var offsetY = -bb.height;
          if (deltaX < 0){
            var offsetX = bb.height / 2;
            var offsetY = -bb.width;
          }
          return 'rotate(' + val + ' ' + bb.x + ' ' + bb.y + ') translate(' + (bb.x + offsetX  ) + ' ' + (bb.y + offsetY ) + ')';
        }
      }
    });
  }

  return EdgeMenu;
}(d3));
