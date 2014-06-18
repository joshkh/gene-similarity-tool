/** Load sub modules, and get a reference to angular **/
define(['angular', 'underscore', './controllers', './services'], function (angular, _) {

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

  App.directive('blurOnClick', function () {
    return {
      restrict: 'A',
      link: function (scope, $element) {
        var el = $element[0];
        $element.on('click', el.blur.bind(el));
      }
    };
  });

});
