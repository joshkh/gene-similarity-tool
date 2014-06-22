// main.js
require.config({
  baseUrl: 'js',
  paths: {
    underscore: '/bower_components/underscore/underscore',
    angular: '/bower_components/angular/angular', 
    imjs: '/bower_components/imjs/js/im',
    "angular-route": '/bower_components/angular-route/angular-route',
    "angular-ui": '/bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls',
    domReady: '/bower_components/requirejs-domready/domReady',
    'd3': '/bower_components/d3/d3',
    'spin': './spin.min'
  },
  shim: {
    'angular': {
      exports: 'angular'
    },
    'angular-route': ['angular'],
    'angular-ui': ['angular'],
    underscore: {exports: '_'},
    d3: {exports: 'd3'},
    'spin': {exports: 'Spinner'}
  },
  priority: [ 'angular' ]
});


var deps = ['domReady!', 'angular', 'd3', 'imjs', 'app'];

require(deps, function(document, ng) {
  //The call to setTimeout is here as it makes loading the app considerably more reliable.
  // Depending on compilation sequence, various modules were not being found. This is dumb, and
  // a better way ought to be found.
  console.log("dom is ready again");
  
  setTimeout(function () {ng.bootstrap(document, ['genecompare-tool']);}, 1000);
});
