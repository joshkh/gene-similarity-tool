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

            

        // setInterval(function() {
        //     console.log("pushing", links);
        //   links.push({source: "HELLO1", target: "HELLO2"}, {source: "HELLO1", target: "HELLO3"});
        // }, 500);

        links.push({source: "HELLO0", target: "HELLO2"}, {source: "HELLO1", target: "HELLO3"});
        links.push({source: "GOODBYE1", target: "GOODBYE2"}, {source: "GOODBYE1", target: "GOODBYE3"});
        links.push({source: "GOODBYE1", target: "GOODBYE2"}, {source: "GOODBYE1", target: "HELLO1"});

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

        console.log("d3 values", d3.values(nodes));

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

        function restart() {

             

            
            link = link.data(links);



            nodes["HELLO7"] = {source: "HELLO5", target: "HELLO6"};

            console.log("links from within restart: ", nodes);
            console.log("next node", nodes["HELLO7"]);

            link.enter().insert("line", ".node")
                .attr("class", "link");

            node = node.data(nodes);

            node.enter().insert("circle", ".cursor")
                .attr("class", "node")
                .attr("r", 15)
                .call(force.drag);



            force = d3.layout.force()
                .nodes(d3.values(nodes))
                .links(links)
                .size([width, height])
                .linkDistance(100)
                .charge(-200)
                .gravity(0.25)
                .friction(0.5)
                .on("tick", tick)
                .start();



            force.start();

        }


        function click(d) {
            
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







            console.log("force.links", link);



scope.$watch('myData', function(){
              console.log("DATA", scope.myData);
          }, true); 



    nodes["AAAAAAAAAAAAAAAAAAAAAA"] = {id: 3};

    console.log("NODS", nodes);

    setTimeout(function() {
        restart();
        console.log("called from within timeout");
    }, 1000);



  // links.push({source: a, target: b}, {source: a, target: c}, {source: b, target: c});



});



    } 
      };
      return directiveDefinitionObject;
   });




});
