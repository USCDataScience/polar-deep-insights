gViz.Engine = (function(defaultConfig, behavior, merger, Vertex, Edge, VertexMenu, EdgeMenu, d3){
  var graph = {};

  function merge(config){
    return config ? merger().extend({}, defaultConfig, config) : defaultConfig;
  };

  function Graph(elem, config, metadata, menuActions, edgeActions){
    var self = this;

    function init(){
      self.viewport = d3.select(elem);
      self.originElement = elem;
      self.svg;
      self.config = merge(config);
      // self.config.width = $(elem).width();
      self.metadata = merger().extend({}, metadata);
      self.menuActions = menuActions;
      self.edgeActions = edgeActions;
      self.events = {}
      self.vertices = {};
      self.edges = {}
      self.links = [];
      self.nodes = [];
      self.force = d3.layout.force();
      self.colors = d3.scale.category20();
      self.selected = null;
      self.dragNode = null;

      self.classesInCanvas = [];
      self.changer = initChanger();
    };

    function initChanger(){
      var change = [];
      change['display'] = function(clazz, prop, val){
        if(!self.config.classes[clazz]){
            self.config.classes[clazz] = {}
        }
        self.config.classes[clazz].display = val;
        d3.selectAll('g.vertex-' + clazz.toLowerCase())
          .selectAll('.vlabel')
          .attr('class', 'vlabel')
          .text(bindName);
      }
      change['icon'] = function(clazz, prop, val){
        if(!self.config.classes[clazz]){
          self.config.classes[clazz] = {}
        }
        self.config.classes[clazz].icon = val;
        d3.selectAll('g.vertex-' + clazz.toLowerCase())
          .selectAll('.vlabel')
          .attr('class', 'vlabel vicon')
          .attr('y', 6)
          .text(val);
      };

      var style = function(clazz, prop, val){
        if(!self.config.classes[clazz]){
          self.config.classes[clazz] = {}
        };

        self.config.classes[clazz][prop] = val;

        d3.selectAll('g.vertex-' + clazz.toLowerCase())
          .selectAll('.vcircle')
          .style(prop, val);

        d3.selectAll('g.legend-' + clazz.toLowerCase())
          .selectAll("circle")
          .style(prop, val);
      };

      change['fill'] = style;
      change['stroke'] = style;
      change['r'] = function(clazz, prop, val){
        if(!self.config.classes[clazz]){
          self.config.classes[clazz] = {}
        }
        self.config.classes[clazz][prop] = val;
        d3.selectAll('g.vertex-' + clazz.toLowerCase())
          .selectAll('.vcircle')
          .attr('r', bindRadius);

        self.setSelected(self.selected);
      };

      return change;
    };

    function clearArrow(){
      if(self.dragNode){
        self.dragNode = null;
        self.drag_line
          .classed('hidden', true)
          .style('marker-end', '');
      };
    };

    function bindClassName(d){
      d.elem = this;
      var cname = d.groupIdentifier();
      var css = self.getClazzConfigVal(cname, "css");
      var cls = 'vertex ';
      if(cname){
          cls += 'vertex-' + cname.toLowerCase();
      }
      return css ? cls + ' ' + css : cls;
    };

    function clickcancel(){
      var event = d3.dispatch('click', 'dblclick');

      function cc(selection){
        var down,
          tolerance = 5,
          last,
          wait = null;
        // euclidean distance
        function dist(a, b){
          return Math.sqrt(Math.pow(a[0] - b[0], 2), Math.pow(a[1] - b[1], 2));
        };
        selection.on('mousedown', function(){
          down = d3.mouse(document.body);
          last = +new Date();
        });
        selection.on('mouseup', function(v){
          if(dist(down, d3.mouse(document.body)) > tolerance){
            return;
          } else {
            if(wait){
              window.clearTimeout(wait);
              wait = null;
              event.dblclick(d3.event, v);
            } else {
              wait = window.setTimeout((function(e){
                  return function(){
                      event.click(e, v);
                      wait = null;
                  };
              })(d3.event), 300);
            }
          }
        });
      };
      return d3.rebind(cc, event, 'on');
    };

    function bindRadius(d){
      var radius = self.getClazzConfigVal(d.groupIdentifier(), "r");
      return radius || d.source.size || self.getConfigVal("node").r;
    };

    function bindOpacity(d){
      if(!d.loaded) return '0.5';
      return "1";
    };

    function bindFill(d){
      var clsName = d.groupIdentifier();
      var fill = self.getClazzConfigVal(clsName, "fill");
      if(!fill){
        fill = d3.rgb(self.colors(clsName.toString(2))).toString();
        self.changeClazzConfig(clsName, "fill", fill);
      }
      return fill;
    };

    function bindStroke(d){
      var clsName = d.groupIdentifier();
      var stroke = self.getClazzConfigVal(clsName, "stroke");
      if(!stroke){
        stroke = d3.rgb(self.colors(clsName.toString(2))).darker().toString();
        self.changeClazzConfig(clsName, "stroke", stroke);
      }
      return stroke;
    };

    function bindDashArray(d){
      if(!d.loaded) return '5,5';
      return "0";
    };

    function bindName(d){
      var name = self.getClazzConfigVal(d.groupIdentifier(), "icon");
      if(!name){
        name = self.getClazzConfigVal(d.groupIdentifier(), "display", d.source);
      };
      return ( name ||  d.identifier());
    };

    function refreshSelected(change){
      if(self.selected){
        var selR = parseInt(bindRadius(self.selected));
        self.menu.refreshPosition(selR, change);
      };
    };

    this.addClassToCanvas = function(className){
      if(this.classesInCanvas.indexOf(className) == -1){
        this.classesInCanvas.push(className);
      };
    };

    this.toggleLegend = function(){
      var parent = d3.select(this.classesContainer.node().parentNode);
      var cls = parent.attr("class");
      if(cls.indexOf("hide") != -1){
        parent.attr("class", "legend-container");
      } else {
        parent.attr("class", "legend-container hide");
      }
    };

    this.fullScreen = function(element){
      var handleScreenSizeChange = function(){
        if(window.fullScreenApi.isFullScreen()){
          var height = $(document).height();
          var width = $(document).width();
          this.svgContainer
            .attr('height', height)
            .attr('width', width);
        } else {
          this.svgContainer
            .attr('height', self.config.height)
            .attr('width', self.config.width);
        };
      }.bind(this);

      window.fullScreenApi.onScreenSizeChange(handleScreenSizeChange);

      $(element).requestFullScreen();
    };

    this.setSelected = function(v){
      var newSel = v != self.selected;
      self.selected = v;
      refreshSelected(newSel);
      self.edgeMenu.hide();
    };

    this.clearGraph = function(){
      self.clearSelection();
      self.vertices = {};
      self.edges = {};
      self.classesInCanvas = [];
      self.nodes.splice(0, self.nodes.length);
      self.links.splice(0, self.links.length);
    };

    this.inititalize = function(){
      var self = this;
      this.force.nodes(this.nodes)
        .links(this.links)
        .size([this.config.width, this.config.height])
        .linkDistance(this.config.linkDistance)
        .charge(this.config.charge)
        .friction(this.config.friction)

      var mst = 100
      var mas = 60
      var mtct = 1000 / mas
      var now = function(){
        return Date.now();
      }

      var tick = this.force.tick;

      this.force.tick = function(){
        var startTick = now()
        step = mst
        while (step-- && (now() - startTick < mtct)){
          if(tick()){
            mst = 2
            return true
          }
        }
        var rnd = Math.floor((Math.random() * 100) + 1);
        if(rnd % 2 == 0){
          self.tick();
        }
        return false;
      };

      this.svgContainer = this.viewport.append('svg');


      // define arrow markers for graph links
      this.svgContainer.append('svg:defs').append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 6)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#000')
        .attr('class', 'end-arrow');

      this.svgContainer.append('svg:defs').append('svg:marker')
        .attr('id', 'start-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 4)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M10,-5L0,0L10,5')
        .attr('class', 'end-arrow');

      // define arrow markers for graph links
      this.svgContainer.append('svg:defs').append('svg:marker')
        .attr('id', 'end-arrow-hover')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 6)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('class', 'end-arrow-hover');

      this.svgContainer.append('svg:defs').append('svg:marker')
        .attr('id', 'start-arrow-hover')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 4)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M10,-5L0,0L10,5')
        .attr('fill', '#000')
        .attr('class', 'end-arrow-hover');


      this.svg = this.svgContainer
        .attr('width', self.config.width)
        .attr('height', self.config.height)
        .append("g");

      // line displayed when dragging new nodes
      this.drag_line = this.svg.append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0');


      this.svgContainer.on("click", function(){
        self.clearSelection();
        clearArrow();
      });

      this.svgContainer.on('mousemove', function(){
        if(!self.dragNode) return;
        // update drag line
        self.drag_line.attr('d', 'M' + self.dragNode.x + ',' + self.dragNode.y + 'L' + d3.mouse(self.svg.node())[0] + ',' + d3.mouse(self.svg.node())[1]);
      });

      this.circleSelected = this.svg.append('svg:g').append("svg:circle")
        .attr("class", "selected-vertex selected-vertex-none")
        .attr('r', this.getConfigVal("node").r + 3);

      this.classesContainer = this.svgContainer.append('svg:g')
        .attr("class", "legend-container")
        .attr("transform",function(){
          return "translate(" + (30) + ",30)";
        }).selectAll('g');

      this.path = this.svg.append('svg:g').selectAll('g');
      this.circle = this.svg.append('svg:g').selectAll('g');

      if(self.menuActions){
        this.menu = new VertexMenu(this);
      }
      if(self.edgeActions){
        this.edgeMenu = new EdgeMenu(this);
      }
    };

    this.clearSelection = function(){
      self.selected = null;
      self.menu.hide();
      self.edgeMenu.hide();
    };

    this.startEdgeCreation = function(){
      this.dragNode = self.selected;
      this.clearSelection();
      // reposition drag line
      this.drag_line
        .style('marker-end', 'url(#end-arrow)')
        .classed('hidden', false)
        .attr('d', 'M' + this.dragNode.x + ',' + this.dragNode.y + 'L' + this.dragNode.x + ',' + this.dragNode.y);
    };

    this.endEdgeCreation = function(){
      this.clearSelection();
      clearArrow();
      self.drag_line
        .classed('hidden', true)
        .style('marker-end', '');
    };

    this.drawInternal = function(){
      var self = this;
      this.path = this.path.data(this.links);
      this.circle = this.circle.data(this.nodes, function(d){
        return d.identifier();
      });
      this.classesContainer = this.classesContainer.data(this.classesInCanvas);

      this.clsLegend = this.classesContainer.enter().append("svg:g").attr("class", function(d){
        return "legend legend-" + d.toLowerCase();
      })

      this.classesContainer.exit().remove();
      this.clsLegend.attr("transform", function(d, i){
        return "translate(0," + 25 * i + ")";
      })

      this.clsLegend.append("circle")
        .attr("r", 10)
        .attr('y', function(d, i){

        })
        .style("fill", function(d){
            var fill = self.getClazzConfigVal(d, "fill");
            return fill ? fill : null;
        })
        .style("stroke", function(d){
            var stroke = self.getClazzConfigVal(d, "stroke");
            return stroke ? stroke : null;
        })

      var txt = this.clsLegend.append("text")
        .attr("dy", 5)
        .text(function(d){
          return d;
        })

      txt.each(function(){
        var diff = 15;
        d3.select(this).attr("dx", diff);
      });

      this.pathG = this.path.enter().append('svg:g').attr("class", function(d){
        return 'edge-path';
      });

      this.edgePath = this.pathG.append('svg:path')
        .attr("class", function(d){
          var eclass = d.edge ? "edge" : "edge lightweight"
          return eclass;
        })
        .attr("id", function(d, i){
          return "linkId_" + i;
        })
        .style('marker-start', function(d){
          return d.left ? 'url(#start-arrow)' : '';
        })
        .style('marker-end', function(d){
          return d.right ? 'url(#end-arrow)' : '';
        });

      this.pathG.append('svg:text')
        .attr("class", function(d){
          return "elabel";
        })
        .on("mouseover", function(){
          d3.select(this.parentNode).selectAll('.edge')
            .attr("class", function(d){
              var eclass = d.edge ? "edge" : "edge lightweight"
              return eclass + " edge-hover"
            })
            .style('marker-start', function(d){
              return d.left ? 'url(#start-arrow-hover)' : '';
            })
            .style('marker-end', function(d){
              return d.right ? 'url(#end-arrow-hover)' : '';
            });
        })
        .on("mouseout", function(){
          d3.select(this.parentNode).selectAll('.edge')
            .attr("class", function(d){
              var eclass = d.edge ? "edge" : "edge lightweight"
              return eclass;
            })
            .style('marker-start', function(d){
              return d.left ? 'url(#start-arrow)' : '';
            })
            .style('marker-end', function(d){
              return d.right ? 'url(#end-arrow)' : '';
            });
        })
        .style("text-anchor", "middle")
        .attr("dy", "-5")
        .append("textPath")
        .attr("startOffset", "50%")
        .attr("xlink:href", function(d, i){
          return "#linkId_" + i;
        })
        .text(function(d){ return d.labelToDisplay(); })
        .on("click", function(e){
          d3.event.stopPropagation();
          self.edgeMenu.select({ elem: this, d: e})

          if(self.events['edge/click']){
            self.events['edge/click'](e);
          }
        });

      this.path.exit().remove();

      var g = this.circle.enter().append('svg:g').attr('class', bindClassName);

      g.on('mouseover', function(v){
        if(self.dragNode){
          var r = bindRadius(v);
          var newR = r + (r * 20) / 100;
          d3.select(v.elem).selectAll('circle').attr('r', newR);
        }
      });

      g.on('mouseout', function(v){
        if(self.dragNode){
          d3.select(v.elem).selectAll('circle').attr('r', bindRadius);
        }
      });

      var drag = this.force.drag();

      drag.on("dragstart", function(v){
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
        d3.select(this).classed("fixed", v.fixed);
      });

      drag.on("dragend", function(v){
          d3.event.sourceEvent.stopPropagation();
          d3.select(this).classed("dragging", false);
      });

      g.call(drag);
      var cc = clickcancel();

      g.on('dblclick', function(){
          d3.event.stopPropagation();
      });
      g.call(cc);

      g.on('click', function(v){
        if(self.dragNode && self.events['edge/create']){
          self.events['edge/create'](self.dragNode, v);
          d3.event.stopPropagation();
          self.dragNode = null;
        };
      });
      cc.on('click', function(e, v){
        if(self.events['node/click']){
          if(v.loaded){
            self.events['node/click'](v);
          } else {
            if(self.events['node/load']){
              self.events['node/load'](v, function(res){
                if(Vertex.isVertex(res)){
                  v.loaded = true;
                  v.source = res;
                  d3.select(v.elem).attr('class', bindClassName);
                  d3.select(v.elem).selectAll('circle')
                      .attr('stroke-dasharray', bindDashArray)
                      .attr('fill-opacity', bindOpacity)
                      .attr('r', bindRadius);
                  self.events['node/click'](v);
                }
              });
            }
          }
          self.setSelected(v);
        }
      });
      cc.on('dblclick', function(e, v){
        if(self.events['node/dblclick']){
          self.events['node/dblclick'](v);
        }
      });

      g.append('svg:circle')
          .attr('class', "vcircle")
          .attr('r', bindRadius)
          .attr('stroke-dasharray', bindDashArray)
          .attr('fill-opacity', bindOpacity)
          .style('fill', bindFill)
          .style('stroke', bindStroke);


      g.append('svg:text')
          .attr('x', 0)
          .attr('y', function(d){
              var name = self.getClazzConfigVal(d.groupIdentifier(), "icon");
              return name ? 6 : 4;
          })
          .attr('class', function(d){
              var name = self.getClazzConfigVal(d.groupIdentifier(), "icon");
              return 'vlabel' + (name ? ' vicon' : '');
          })
          .text(bindName);

      this.circle.exit().remove();
      this.viewport.call(d3.behavior.zoom()
          .scaleExtent([0.5, 5])
          .on("zoom", this.zoom));
    };

    this.changeClazzConfig = function(clazz, prop, val){
      if(this.changer[prop]){
        this.changer[prop](clazz, prop, val);
      };
    };

    this.getClazzConfigVal = function(clazz, prop, obj){
      if(!clazz || !prop) return null;
      if(self.config.classes && self.config.classes[clazz] && self.config.classes[clazz][prop]){
        return obj ? obj[self.config.classes[clazz][prop]] : self.config.classes[clazz][prop];
      }
      return null;
    };

    this.getConfig = function(){
      return this.config;
    };

    this.getClazzConfig = function(clazz){
      if(!self.config.classes){
        self.config.classes = {};
      }
      if(!self.config.classes[clazz]){
        self.config.classes[clazz] = {};
      }
      return merger().extend({}, self.config.classes[clazz]);
    };

    this.getConfigVal = function(prop){
      return self.config[prop];
    };

    this.zoom = function(){
      var scale = d3.event.scale;
      var translation = d3.event.translate;
      self.svg.attr("transform", "translate(" + translation + ") scale(" + scale + ")");
    };

    this.tick = function(){
      var path = self.path.selectAll("path.edge");

      path.attr('d', function(){
        var d = d3.select(this.parentNode).datum();
        var radiusSource = self.getClazzConfigVal(d.source.groupIdentifier(), "r");
        var radiusTarget = self.getClazzConfigVal(d.target.groupIdentifier(), "r");

        radiusSource = radiusSource ? radiusSource : self.getConfigVal("node").r;
        radiusTarget = radiusTarget ? radiusTarget : self.getConfigVal("node").r;

        radiusTarget = parseInt(radiusTarget);
        radiusSource = parseInt(radiusSource);

        var deltaX = d.target.x - d.source.x,
          deltaY = d.target.y - d.source.y,
          dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
          normX = deltaX / dist,
          normY = deltaY / dist,
          sourcePadding = d.left ? (radiusSource + 5) : radiusSource,
          targetPadding = d.right ? (radiusTarget + 5) : radiusTarget,
          sourceX = d.source.x + (sourcePadding * normX),
          sourceY = d.source.y + (sourcePadding * normY),
          targetX = d.target.x - (targetPadding * normX),
          targetY = d.target.y - (targetPadding * normY);

        var rel = d.totalCount();

        if(rel == 1){
          return 'M' + sourceX + ',' + sourceY + ' L' + targetX + ',' + targetY;
        } else {
          var realPos = d.indexInSimilar();

          if(realPos == 0){
            var paddingSource = 5;
            var paddingTarget = 5;
            if(deltaX > 0){
              paddingSource = -5;
              paddingTarget = -5;
            }
            return 'M' + (sourceX + paddingSource) + ',' + (sourceY + paddingSource) + ' L' + (targetX + paddingTarget) + ',' + (targetY + paddingTarget);
          }
          var pos = realPos + 1;
          var m = (d.target.y - d.source.y) / (d.target.x - d.source.x);
          var val = (Math.atan(m) * 180) / Math.PI;
          var trans = val * (Math.PI / 180) * -1;
          var radiansConfig = angleRadiants(pos);
          var angleSource;
          var angleTarget;
          var signSourceX;
          var signSourceY;
          var signTargetX;
          var signTargetY;

          if(deltaX < 0){
            signSourceX = 1;
            signSourceY = 1;
            signTargetX = 1;
            signTargetY = 1;
            angleSource = radiansConfig.target - trans;
            angleTarget = radiansConfig.source - trans;
          } else {
            signSourceX = 1;
            signSourceY = -1;
            signTargetX = 1;
            signTargetY = -1;
            angleSource = radiansConfig.source + trans;
            angleTarget = radiansConfig.target + trans;
          }


          sourceX = d.source.x + ( signSourceX * (sourcePadding * Math.cos(angleSource)));
          sourceY = d.source.y + ( signSourceY * (sourcePadding * Math.sin(angleSource)));
          targetX = d.target.x + ( signTargetX * (targetPadding * Math.cos(angleTarget)));
          targetY = d.target.y + ( signTargetY * (targetPadding * Math.sin(angleTarget)));

          var dr = 70;
          return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;
        }
      });

      function angleRadiants(pos){
        switch (pos){
          case 2:
            return {source: Math.PI / 6, target: (5 * Math.PI) / 6}
            break;
          case 3:
            return {source: Math.PI / 3, target: (2 * Math.PI) / 3}
            break;
          case 4:
            return {source: Math.PI / 2, target: Math.PI / 2}
            break;
        }
      };

      if(self.edgeMenu){
        self.edgeMenu.refreshPosition();
      }
      self.circle.attr('transform', function(d){
        return 'translate(' + d.x + ',' + d.y + ')';
      });
      refreshSelected();
    };

    init();
  };

  Graph.prototype = {
    on: function(event, cbk){
      this.events[event] = cbk;
      return this;
    },
    off: function(event){
      this.events[event] = null;
      return this;
    },
    data: function(data){
      if(!data){
        return this;
      };

      var d = data ? angular.copy(data) : [];
      this.lastDataSize = d.length;
      d.forEach(function(elem){
        // If Element is a vertex
        if(Vertex.isVertex(elem)){
          var v = Vertex.load(this, elem);
        }
        // If Element is an edge
        else if(Edge.isEdge(elem)){
          Edge.load(this, elem);
        }
      }.bind(this));
      return this;
    },
    removeVertex: function(v){
      v.remove();
      this.clearSelection();
      this.redraw();
    },
    removeEdge: function(e){
      e.remove();
      this.clearSelection();
      this.redraw();
    },
    draw: function(){
      this.inititalize();
      this.redraw();
    },
    toggleLegend: function(){
      this.toggleLegendInternal();
    },
    update: function(nodes, center, radius){
      var free = nodes.filter(function(e){
        return !(e.x && e.y);
      })
      var len = free.length;
      free.forEach(function(e, i, arr){
        e.x = center.x + radius * Math.sin(2 * Math.PI * i / len)
        e.y = center.y + radius * Math.cos(2 * Math.PI * i / len)
      })
    },
    redraw: function(){
      this.drawInternal();
      this.clearSelection();
      var radius = this.nodes.length * this.config.linkDistance / (Math.PI * 2)
      var center = {x: this.config.width / 2, y: this.config.height / 2 }
      this.update(this.nodes, center, radius)
      this.force.start();
    },
    startEdge: function(){
      this.startEdgeCreation();
    },
    selectNode: function(n){
      this.setSelected(n);
    },
    endEdge: function(){
      this.endEdgeCreation();
    },
    clear: function(){
      this.clearGraph();
      this.redraw();
    }
  };

  // Public interface method. To instantiate the graph visualizer instance.
  graph.create = function(element, config, metadata, vertexActions, edgeActions){
    return new Graph(element, config, metadata, vertexActions, edgeActions);
  };

  return graph;

})(gViz.getConfigration(), gViz.getBehavior(), gViz.merger, gViz.Vertex, gViz.Edge, gViz.VertexMenu, gViz.EdgeMenu, d3);
