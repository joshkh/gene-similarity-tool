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

  	console.log("LOADED");



  	// var serviceName = "Joshua";

  	// console.log("intermine", intermine);

  	// //return serviceName;

  	// $http({method: 'GET', url: '/testurl.txt'}).
   //  success(function(data, status, headers, config) {
   //    // this callback will be called asynchronously
   //    // when the response is available
   //    console.log("status", status, data);
   //  }).
   //  error(function(data, status, headers, config) {
   //    // called asynchronously if an error occurs
   //    // or server returns response with an error status.
   //    console.log("status", status, data);
   //  });

  return result;

  }]);


});
