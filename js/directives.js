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

  Controllers.controller('SearchInputCtrl', ['$scope', 'QueryService', function (scope, QueryService) {

    console.log("QueryService2: ", QueryService);
    console.log("d3", d3);

    
    scope.searchResults = "nothing loaded yet";

    scope.myData = [
    {name: 'AngularJS', count: 300},
    {name: 'D3.JS', count: 150},
    {name: 'jQuery', count: 400},
    {name: 'Backbone.js', count: 300},
    {name: 'Ember.js', count: 100}
    ];

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
