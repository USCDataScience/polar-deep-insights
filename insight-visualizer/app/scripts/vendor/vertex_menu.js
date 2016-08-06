gViz.VertexMenu = (function(d3){

  function VertexMenu(graph){
    var self = this;

    this.graph = graph;
    this.menuContainer = graph.svg.append("g");
    this.menuContainer.attr("class", "menu menu-hide");
    this.subSelected = null;


    this.pie =
      d3.layout.pie()
        .sort(null).value(function(d){
          return 1;
        });

    this.arc =
      d3.svg.arc()
        .innerRadius(0)
        .outerRadius(0);

    this.menuSel = null;

    var menuGroup =
      this.menuContainer.selectAll("g")
        .data(this.pie(graph.menuActions))
        .enter()
        .append("g")
        .attr("class", "menu-entry")
        .on("click",function(d){
          d3.event.stopPropagation();
          if (d.data.onClick){
            d.data.onClick(graph.selected);
          };
        })
        .on("mouseover", function(d){
          if (self.menuSel != null && self.menuSel != this){
            d3.select(self.menuSel).selectAll("g.treemenu").remove();
            d3.select(self.menuSel).selectAll("g.submenu").remove();
          };
          self.menuSel = this;

          if(d.data.submenu){
            if (d.data.submenu.entries instanceof Function){
              var res = d.data.submenu.entries(graph.selected);
            } else {
              var res = d.data.submenu.entries;
            }

            if (d.data.submenu.type == 'tree'){
              if (!d3.select(this).selectAll("g.treemenu").empty()){
                if (self.subSelected == d){
                  return;
                };
              };

              self.subSelected = d;

              var height = 17 * res.length;
              var width = 50;
              var parent = d;

              var orientations = {
                "rtl": {
                  size: [height, width],
                  width: width,
                  offset: -width * 2,
                  x: function(d){
                    return (width * 2) - d.y;
                  },
                  xoff: function(d){
                    return (width) - d.y;
                  },
                  y: function(d){
                    return d.x;
                  }
                },
                "ltr": {
                  size: [height, width],
                  width: width,
                  offset: 0,
                  x: function(d){
                    return d.y;
                  },
                  xoff: function(d){
                    return d.y;
                  },
                  y: function(d){
                    return d.x;
                  }
                }
              };

              var orientation = (d.startAngle >= 0 && d.endAngle <= Math.PI) ? orientations["ltr"] : orientations["rtl"];

              var tree = d3.layout.tree().size(orientation.size);
              var coord = self.arc.centroid(d);

              var diagonal =
                d3.svg.diagonal()
                  .projection(function(d){
                    return [d.y, d.x];
                  });


              var i = 0;
              var data = { name: d.data.name, children: res, x0: coord[0], y0: coord[1], root: true}
              var nodes = tree.nodes(data).reverse();
              var links = tree.links(nodes);

              nodes.forEach(function(d){
                d.y = d.depth * orientation.width;
              });


              var mcontainer = d3.select(this).append('g').attr("class", "treemenu");
              mcontainer.attr("transform", function(d){
                return "translate(" + (coord[0] + orientation.offset) + "," + (coord[1] - (height / 2)) + ")";
              })
              var n = mcontainer.selectAll('g.treenode').data(nodes, function(d){
                return d.id || (d.id = ++i);
              });

              var nodeEnter =
                n.enter().append("g")
                  .attr("class", function(d){
                    return d.root ? "treenode-root" : "treenode";
                  })
                  .attr("transform", function(d){
                    return "translate(" + coord[1] + "," + coord[0] + ")";
                  })


              var txt =
                nodeEnter.append("text")
                  .attr("x", function(d){
                    return d.children || d._children ? -10 : 10;
                  })
                  .attr("dy", ".35em")
                  .attr("text-anchor", function(d){
                    return d.children || d._children ? "end" : "start";
                  })
                  .text(function(d){
                    return d.name;
                  })
                  .style("fill-opacity", 1e-6)
                  .on("click", function(d){
                    d.onClick(graph.selected, d.name);
                  });

              var bbox = txt.node().getBBox();
              var padding = 2;

              nodeEnter.insert("rect", "text")
                .attr("x", bbox.x - padding)
                .attr("y", bbox.y - padding)
                .attr("width", bbox.width + (padding * 2))
                .attr("height", bbox.height + (padding * 2))
                .attr("class", "tree-text-container");

              var nodeUpdate =
                n.transition()
                  .duration(750)
                  .attr("transform", function(d){
                    return "translate(" + orientation.xoff(d) + "," + orientation.y(d) + ")";
                  });


              nodeUpdate.select("text")
                .style("fill-opacity", 1).attr("class", "tree-text-menu")

              var link =
                mcontainer.selectAll("path.treelink")
                  .data(links, function(d){
                    return d.target.id;
                  });

              // Enter any new links at the parent's previous position.
              link.enter().insert("path", "g")
                  .attr("class", "treelink")
                  .attr("d", function(d){
                    var o = {x: coord[0], y: coord[1]};
                    return diagonal({source: o, target: o});
                  });

              // Transition links to their new position.
              link.transition()
                  .duration(750)
                  .attr("d", d3.svg.diagonal().projection(function(d){
                    return [orientation.x(d), orientation.y(d)];
                  }));

              // Transition exiting nodes to the parent's new position.
            } else {
              if (!d3.select(this).selectAll("g.submenu").empty()){
                return;
              }

              var arcSub =
                d3.svg.arc()
                  .innerRadius(d.innerRadius + 40)
                  .outerRadius(d.innerRadius);

              var sEntry = d3.select(this).append("g").attr("class", "submenu");

              var entryGroup =
                sEntry.selectAll("g")
                  .data(self.pie(res))
                  .enter()
                  .append("g")
                  .attr("class", "submenu-entry")
                  .on("click", function(sd){
                    d3.event.stopPropagation();
                    if (sd.data.onClick){
                      sd.data.onClick(graph.selected, sd.data.name);
                    };
                  });

              var submenu =
                entryGroup.append("path")
                  .attr("fill", function(d, i){
                    return graph.colors(i);
                  })
                  .attr("d", arcSub)
                  .attr("id", function(d, i){
                    return "subpath" + i;
                  })
                  .attr("class", "menu-path");

              var submenuText =
                entryGroup.append("text")
                  .attr("class", "menu-text")
                  .attr("transform", function(d){
                    return "translate(" + arcSub.centroid(d) + ")";
                  })
                  .attr("dy", ".35em")
                  .text(function(d){
                    return d.data.name;
                  });
            }
          };
        })
        .on("mouseout", function(d){

        });

    this.menu =
      menuGroup.append("path")
        .attr("fill", function(d, i){
            return graph.colors(i);
        })
        .attr("d", this.arc)
        .attr("class", "menu-path")

    this.menuText =
      menuGroup.append("text")
        .attr("class", "menu-text")
        .attr("transform", function(d){
          return "translate(" + self.arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .text(function(d){
          return d.data.name;
        })
  };


  VertexMenu.prototype.hide = function(){
    var self = this;

    self.clearSubMenu();
    self.menuContainer.attr("class", "menu menu-hide");
  };

  VertexMenu.prototype.clearSubMenu = function(){
    var self = this;

    if(self.menuSel != null){
      d3.select(self.menuSel).selectAll("g.treemenu").remove();
    };
  };

  VertexMenu.prototype.refreshPosition = function(selR, change){
    var self = this;

    self.menuContainer.attr('transform', function(){
      return 'translate(' + self.graph.selected.x + ',' + self.graph.selected.y + ')';
    });

    self.menuContainer.attr("class", "menu");

    function tweenPie(b){
      b.outerRadius = selR;
      b.innerRadius = selR + 40;
      var i = d3.interpolate({startAngle: 0, endAngle: 0, outerRadius: 0, innerRadius: 0}, b);
      return function(t){
        return self.arc(i(t));
      };
    };

    self.arc.innerRadius(selR);
    self.arc.outerRadius(selR + 40);
    self.menu.attr("d", self.arc);
    if(change){
      self.menu.transition()
        .ease("exp-out")
        .duration(500)
        .attr("d", self.arc)
        .each("end", function(d){

        })
        .attrTween("d", tweenPie);
    };

    self.menuText.attr("transform", function(d){
      return "translate(" + self.arc.centroid(d) + ")";
    });
  };

  return VertexMenu;

}(d3));
