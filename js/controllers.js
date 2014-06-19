define(['angular', 'underscore', 'd3'], function (angular, _, d3) {

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
