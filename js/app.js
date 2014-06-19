/** Load sub modules, and get a reference to angular **/
define(['angular', 'underscore', 'd3', './controllers', './services'], function (angular, _, d3) {

	'use strict';
	
	var App = angular.module('genecompare-tool', [
    'genecompare-tool.controllers',
    'genecompare-tool.services'
  ]);

  App.filter('mappingToArray', function() { return function(obj) {
    if (!(obj instanceof Object)) return obj;
    return _.map(obj, function(val, key) {
      return Object.defineProperty(val, '$key', {__proto__: null, value: key});
    });
  }});

  App.filter('orderObjectBy', function(){
   return function(input, attribute) {
      if (!angular.isObject(input)) return input;

      var array = [];
      for(var objectKey in input) {
          array.push(input[objectKey]);
      }

      array.sort(function(a, b){
          a = parseInt(a[attribute]);
          b = parseInt(b[attribute]);
          return a - b;
      });
      return array;
   }
  });

  App.filter('scoreRangeFilter', function() {
    return function(item, attribute) {
      // if (item.totalscore >= $scope.minscore);
    }

  });




  App.directive('blurOnClick', function () {
    return {
      restrict: 'A',
      link: function (scope, $element) {
        var el = $element[0];
        $element.on('click', el.blur.bind(el));
      }
    };
  });



App.directive('ngChart', function() {
    var directive = {};

    console.log("d3:", d3);

    directive.restrict = 'E'; /* restrict this directive to elements */
    directive.template = "My first directive: {{textToInsert}}";

    return directive;
});


App.directive('barsChart', function ($parse) {
     //explicitly creating a directive definition variable
     //this may look verbose but is good for clarification purposes
     //in real life you'd want to simply return the object {...}
     var directiveDefinitionObject = {


         //We restrict its use to an element
         //as usually  <bars-chart> is semantically
         //more understandable
         restrict: 'E',
         //this is important,
         //we don't want to overwrite our directive declaration
         //in the HTML mark-up
         replace: false,
         //our data source would be an array
         //passed thru chart-data attribute
         scope: {data: '=chartData'},
         link: function (scope, el) {

        console.log("data", scope.data);

        var el = el[0];
        // get the data
        d3.csv("force.csv", function(error, links) {

        var nodes = {};

        // Compute the distinct nodes from the links.
        links.forEach(function(link) {
            link.source = nodes[link.source] || 
                (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] || 
                (nodes[link.target] = {name: link.target});
            link.value = +link.value;
        });

        var width = 1200,
            height = 1200;

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(100)
            .charge(-200)
            .gravity(0.25)
            .friction(0.5)
            .on("tick", tick)
            .start();

        var svg = d3.select(el).append("svg")
            .attr("width", width)
            .attr("height", height);

        // build the arrow.
        var marker = svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
          .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 18)
            .attr("refY", -1.5)
            .attr("markerWidth", 8)
            .attr("markerHeight", 8)
            .attr("orient", "auto")
            .attr("class", "link")
          .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");


            // add the links and the arrows
        var link = svg.append("svg:g").selectAll("path")
            .data(force.links())
          .enter().append("svg:path")
            .attr("class", "link")
            .attr("marker-end", "url(#end)");

        // define the nodes
        var node = svg.selectAll(".node")
            .data(force.nodes())
          .enter().append("g")
            .attr("class", "node")
            .on("click", click)
            .call(force.drag)
            .on("mouseover", fade(.15))
            .on("mouseout", fade(1));
            

        // add the nodes
        node.append("circle")
            .attr("r", 6)
            .attr("class", isParent);
            

        // add the text 
        node.append("text")
            .attr("x", 12)
            .attr("dy", "1em")
            .text(function(d) { return d.name; });

        

        var linkedByIndex = {};
        links.forEach(function(d) {
            linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });

        links.forEach(function(link) {
            //console.log("link: ", link);
            var source = link.source;
            //console.log("-- source:", source);
        });

        function click(d) {
            //console.log("clicked: ", d);
        }

        function isParent(d) {
            var sourceNames = [];
            //console.log("isParent: ", d.name);
            // build an array of source genes
            links.forEach(function(o) {
                sourceNames.push(o.source.name);
            });

            if (_.contains(sourceNames, d.name)) {
                //console.log("parent");
                return "parent";
            } else {
                //console.log("child");
                return "child";
            }

        }

        




        function fade(opacity) {
        return function(d) {


            node.style("stroke-opacity", function(o) {
                var thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });

            node.style("stroke-opacity", function(o) {
                var thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });


            link.style("opacity", function(o) {
                // console.log("inside link style: ", o);
                return o.source === d || o.target === d ? 1 : opacity;
            });



        };
        }

        function isConnected(a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        }







          // Toggle children on click.
        // function click(d) {
        //   // if (d.children) {
        //   //   d._children = d.children;
        //   //   d.children = null;
        //   // } else {
        //   //   d.children = d._children;
        //   //   d._children = null;
        //   // }
        //   console.log(d);
        // }

        // add the curvy lines
        function tick() {
            link.attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" + 
                    d.source.x + "," + 
                    d.source.y + "A" + 
                    dr + "," + dr + " 0 0,1 " + 
                    d.target.x + "," + 
                    d.target.y;
            });

            node
                .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; });
    }



scope.$watch('myData', function(){
              console.log("DATA", scope.myData);
          }, true); 
});



    } 
      };
      return directiveDefinitionObject;
   });






App.directive('barsNetwork', function ($parse) {
     //explicitly creating a directive definition variable
     //this may look verbose but is good for clarification purposes
     //in real life you'd want to simply return the object {...}
     var directiveDefinitionObject = {


         //We restrict its use to an element
         //as usually  <bars-chart> is semantically
         //more understandable
        restrict: 'E',
         //this is important,
         //we don't want to overwrite our directive declaration
         //in the HTML mark-up
        replace: false,
         //our data source would be an array
         //passed thru chart-data attribute
        scope: {data: '=chartData'},
        link: function (scope, el) {

            console.log("data in directive", scope.data);
            root = scope.data;

            var el = el[0];

            var width = 960,
                height = 500,
                root;

            var force = d3.layout.force()
                .linkDistance(80)
                .charge(-120)
                .gravity(.05)
                .size([width, height])
                .on("tick", tick);

            var svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height);

            var link = svg.selectAll(".link"),
                node = svg.selectAll(".node");



            scope.render = function update() {



                console.log("... rendering ...");

              var nodes = flatten(root),
                  links = d3.layout.tree().links(nodes);

              // Restart the force layout.
              force
                  .nodes(nodes)
                  .links(links)
                  .start();

              // Update links.
              link = link.data(links, function(d) { return d.target.id; });

              link.exit().remove();

              link.enter().insert("line", ".node")
                  .attr("class", "link");

              // Update nodes.
              node = node.data(nodes, function(d) { return d.id; });

              node.exit().remove();

              var nodeEnter = node.enter().append("g")
                  .attr("class", "node")
                  .on("click", click)
                  .call(force.drag);

              nodeEnter.append("circle")
                  .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; });

              nodeEnter.append("text")
                  .attr("dy", ".35em")
                  .text(function(d) { return d.name; });

              node.select("circle")
                  .style("fill", color);
                            }

                            function tick() {
                  link.attr("x1", function(d) { return d.source.x; })
                      .attr("y1", function(d) { return d.source.y; })
                      .attr("x2", function(d) { return d.target.x; })
                      .attr("y2", function(d) { return d.target.y; });

                  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                }

                function color(d) {
                  return d._children ? "#3182bd" // collapsed package
                      : d.children ? "#c6dbef" // expanded package
                      : "#fd8d3c"; // leaf node
                }

                // Toggle children on click.
                function click(d) {
                  if (d3.event.defaultPrevented) return; // ignore drag
                  if (d.children) {
                    d._children = d.children;
                    d.children = null;
                  } else {
                    d.children = d._children;
                    d._children = null;
                  }
                  scope.render();
                }

                // Returns a list of all nodes under the root.
                function flatten(root) {
                  var nodes = [], i = 0;

                  function recurse(node) {
                    if (node.children) node.children.forEach(recurse);
                    if (!node.id) node.id = ++i;
                    nodes.push(node);
                  }

                  recurse(root);
                  return nodes;
                }

                scope.$watch('data', function(){
                  scope.render(scope.data);
                }, true);









        } 
    };

    return directiveDefinitionObject;

});

App.directive('networkChartOld', function() {



    function link(scope, el) {

        console.log("data from directive", scope);

        var el = el[0];
        // get the data
        d3.csv("force.csv", function(error, links) {

        var nodes = {};

        // Compute the distinct nodes from the links.
        links.forEach(function(link) {
            link.source = nodes[link.source] || 
                (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] || 
                (nodes[link.target] = {name: link.target});
            link.value = +link.value;
        });

        var width = 1200,
            height = 1200;

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(100)
            .charge(-200)
            .gravity(0.25)
            .friction(0.5)
            .on("tick", tick)
            .start();

        var svg = d3.select(el).append("svg")
            .attr("width", width)
            .attr("height", height);

        // build the arrow.
        var marker = svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
          .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 18)
            .attr("refY", -1.5)
            .attr("markerWidth", 8)
            .attr("markerHeight", 8)
            .attr("orient", "auto")
            .attr("class", "link")
          .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");


            // add the links and the arrows
        var link = svg.append("svg:g").selectAll("path")
            .data(force.links())
          .enter().append("svg:path")
            .attr("class", "link")
            .attr("marker-end", "url(#end)");

        // define the nodes
        var node = svg.selectAll(".node")
            .data(force.nodes())
          .enter().append("g")
            .attr("class", "node")
            .on("click", click)
            .call(force.drag)
            .on("mouseover", fade(.15))
            .on("mouseout", fade(1));
            

        // add the nodes
        node.append("circle")
            .attr("r", 6)
            .attr("class", isParent);
            

        // add the text 
        node.append("text")
            .attr("x", 12)
            .attr("dy", "1em")
            .text(function(d) { return d.name; });

        

        var linkedByIndex = {};
        links.forEach(function(d) {
            linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });

        links.forEach(function(link) {
            //console.log("link: ", link);
            var source = link.source;
            //console.log("-- source:", source);
        });

        function click(d) {
            //console.log("clicked: ", d);
        }

        function isParent(d) {
            var sourceNames = [];
            //console.log("isParent: ", d.name);
            // build an array of source genes
            links.forEach(function(o) {
                sourceNames.push(o.source.name);
            });

            if (_.contains(sourceNames, d.name)) {
                //console.log("parent");
                return "parent";
            } else {
                //console.log("child");
                return "child";
            }

        }

        




        function fade(opacity) {
        return function(d) {


            node.style("stroke-opacity", function(o) {
                var thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });

            node.style("stroke-opacity", function(o) {
                var thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });


            link.style("opacity", function(o) {
                // console.log("inside link style: ", o);
                return o.source === d || o.target === d ? 1 : opacity;
            });



        };
        }

        function isConnected(a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        }







          // Toggle children on click.
        // function click(d) {
        //   // if (d.children) {
        //   //   d._children = d.children;
        //   //   d.children = null;
        //   // } else {
        //   //   d.children = d._children;
        //   //   d._children = null;
        //   // }
        //   console.log(d);
        // }

        // add the curvy lines
        function tick() {
            link.attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" + 
                    d.source.x + "," + 
                    d.source.y + "A" + 
                    dr + "," + dr + " 0 0,1 " + 
                    d.target.x + "," + 
                    d.target.y;
            });

            node
                .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; });
    }

    console.log("DATA", scope.data);

scope.$watch('myData', function(){
              console.log("DATA", scope.myData);
          }, true); 
});



    }
     

    return {
        link: link,
        restrict: 'E',
        scope: {chartdata2: '=' }
    }
});

});
