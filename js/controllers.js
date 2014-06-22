define(['angular', 'underscore', 'd3', 'spin'], function (angular, _, d3, spin) {

	var Controllers = angular.module('genecompare-tool.controllers', []);

  function DemoCtrl (scope, timeout) {


    scope.messages = {ids: {}};

    scope.sumAvailable = 0;
    
    scope.$watch('messages', function () {
      var sum = 0;
      _.values(scope.messages.ids).forEach(function (data) {
        sum += data.request.ids.length;
      });
      scope.sumAvailable = sum;
    });

    scope.$on('has', function (event, message) {
      // this horror is one of the best arguments for using react.
      scope.messages[message.what][message.key] = message.data;
      timeout(function () {
        scope.messages = _.extend({}, scope.messages); 
      });
    });

  }

  DemoCtrl.$inject = ['$scope', '$timeout'];

	Controllers.controller('DemoCtrl', DemoCtrl);

	Controllers.controller('SearchInputCtrl', ['$scope', 'QueryService', 'IDResolverService', function (scope, QueryService, IDResolverService) {


    var opts = {
      lines: 13, // The number of lines to draw
      length: 20, // The length of each line
      width: 10, // The line thickness
      radius: 30, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '50%', // Top position relative to parent
      left: '50%' // Left position relative to parent
    };

    var target = document.getElementById('spinner');

    var spinner;

    scope.myData = [10,20,30,40,60];

    scope.flaredata = {
     "name": "flare",
     "children": [
      {
       "name": "analytics",
       "children": [
        {
         "name": "cluster",
         "children": [
          {"name": "AgglomerativeCluster", "size": 3938},
          {"name": "CommunityStructure", "size": 3812},
          {"name": "HierarchicalCluster", "size": 6714},
          {"name": "MergeEdge", "size": 743}
         ]
        },
        {
         "name": "graph",
         "children": [
          {"name": "BetweennessCentrality", "size": 3534},
          {"name": "LinkDistance", "size": 5731},
          {"name": "MaxFlowMinCut", "size": 7840},
          {"name": "ShortestPaths", "size": 5914},
          {"name": "SpanningTree", "size": 3416}
         ]
        },
        {
         "name": "optimization",
         "children": [
          {"name": "AspectRatioBanker", "size": 7074}
         ]
        }
       ]
      }
     ]
    }


    scope.resolveIds = function(aValue) {

       spinner = new spin(opts).spin(target);

      var symbolArr = aValue.split(/[\s,]+/)
      console.log("split", symbolArr);

      // Resolve our ids based on the symbols
      var resolvedIds = IDResolverService.getIdsFromSymbols(symbolArr);
      resolvedIds.then(function(myResults){
        console.log("from outside", myResults);
        console.log("matches", myResults.matches.MATCH);



        var searchIds = [];
        for (item in myResults.matches.MATCH) {
          searchIds.push(myResults.matches.MATCH[item].id);
        }



        // rejoin the array FOR NOW (TBD)

        var stringified = searchIds.join();

        var promise = QueryService.getResults(stringified);
        promise.then(function(value) {
          scope.searchResults = value;
          console.log("myResults", scope.searchResults);

          spinner.stop();


        });



      })

    }

    scope.addstuff = function() {


      var nextobj = {
         "name": "XXXXXXXXXX",
         "children": [
          {"name": "AgglomerativeCluster", "size": 3938},
          {"name": "CommunityStructure", "size": 3812},
          {"name": "HierarchicalCluster", "size": 6714},
          {"name": "MergeEdge", "size": 743}
         ]
        }

      scope.flaredata.children.push(nextobj);


    }

    scope.complain = function(value) {
      console.log("performing search with the following values: ", value);
      var promise = QueryService.getResults("1112303,1076450,1058436");
      promise.then(function(value) {
        scope.searchResults = value;
      });

    }



   }]);

	// Controllers.controller('SearchResultsCtrl', SearchResultsCtrl);

});
