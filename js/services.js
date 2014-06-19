define(['angular', 'imjs'], function (angular, intermine) {

  'use strict';

  var Services = angular.module('genecompare-tool.services', []);

  Services.factory('QueryService', ['$http', function ($http) {

  	var result = {};

  	result.getResults = function(idsStringified) {
  		var ids = idsStringified;
		  var request = $http({
  			// method: "get",
  			// url: "http://cdn.rodeorockstar.com/like.json",
        url: 'http://beta.flymine.org/beta/service/recommendations/similarity',
			// url: "http://preview.flymine.org/preview/service/recommendations/similarity",
			params: {
				id: ids
			}
		});

		return (request.then(handleSuccess, handleError));

  	}

  	function handleSuccess( response ) {
  		console.log("RESPONDING with", response.data);
  		return response.data
  	}

  	function handleError (response ) {
      console.log("Error loading JSON data");
      console.log("Response", response);
  		return false;
  	}

  return result;

  }]);


  Services.factory('IDResolverService', ['$http', '$q', function ($http, $q) {

    var result = {};

    console.log("IMJS: ", intermine);

    result.getIdsFromSymbols = function(symbols) {

      var deferred = $q.defer();

      var request = {"identifiers": symbols, "type": "Gene","caseSensitive": true,"wildCards": true,"extra": "D. melanogaster"}
      var service = intermine.Service.connect({root: 'www.flymine.org/query'});

      var jobbing = service.resolveIds(request);

      return jobbing.then(function (job) {
        return job.poll(); // Always clean up.
        // job.poll().then(function(){console.log("RESULTS", results)}).then(job.del, job.del); // Always clean up.
      });

    }

    

     

    function withResults (results) {
      console.log("from with results", results);
    }




  return result;

  }]);







});
