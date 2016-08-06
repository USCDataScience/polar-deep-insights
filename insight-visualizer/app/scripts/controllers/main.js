'use strict';

/**
 * @ngdoc function
 * @name polar.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the polar
 */
angular.module('polar')
.controller('MainCtrl', ["$scope", "$timeout", "tg.graph.aside.$aside", function ($scope, $timeout, Aside) {

  $scope.onGraphLoad = function(graph) {
    $scope.graph = graph;

    $scope.graph.on('node/click', function (v) {
      Aside.refresh(v);
    });

    $scope.graph.on('edge/create', function (v1, v2) {
      $scope.graph.data([{ "out": v1.identifier(), "in": v2.identifier(), type: "refers" }]).redraw();
      $scope.$apply(function(){
        $scope.graph.endEdgeCreation();
      });
    });

    $scope.graph.on('edge/click', function (e) {
      Aside.refresh(e);
    });

    $scope.graph.on('node/dblclick', function (v) {
      console.log("node/dblclick")
    });

    $scope.graph.on('node/load', function (v, callback) {
      console.log("node/load")
    });
  };

  $scope.edgeMenu = [
    {
      name: '\uf044',
      onClick: function (e){

      }
    },{
      name: '\uf06e',
      placeholder: "Inspect",
      onClick: function (e) {
        Aside.open(e);
      }
    },{
      name: '\uf127',
      placeholder: "Remove edge",
      onClick: function (e) {
        $scope.graph.removeEdge(e);
      }
    }
  ];

  $scope.nodeMenu = [
    {
      name: '\uf044',
      onClick: function (v) {
      }
    },{
      name: "\uf014",
      placeholder: "Delete vertex",
      onClick: function (v, label) {
        $scope.graph.removeVertex(v);
      }
    },
    {
      name: "\uf12d",
      placeholder: "Remove from canvas",
      onClick: function (v, label) {
        $scope.graph.removeVertex(v);
      }
    },{
      name: "\uf0c1",
      placeholder: "Connect",
      onClick: function (v) {
        $scope.graph.startEdge();
      }
    },{
      name: "\uf06e",
      placeholder: "Inspect",
      onClick: function (v) {
        // INSPECT VERTEX
        Aside.open(v);
      }
    }
  ];

  $scope.metadata = {};
  $scope.configration = {};
  $scope.behavior = {};

  $timeout(function(){
    //initial data
    $scope.dataStream = [

      {"id":"#1","type":"Bevy", "name": "Bevy"},
      {"id":"#2","type":"Bevy-Android", "name": "Bevy-Android"},
      {"id":"#3","type":"Ether", "name": "Ether"},

      {"id":"#E-1","type":"Employee", "name": "Anand Narayanan"},
      {"id":"#E-2","type":"Employee", "name": "Abhishek Sarkar"},
      {"id":"#E-3","type":"Employee", "name": "Nithin Krishna"},
      {"id":"#E-4","type":"Employee", "name": "Marudhu Pandian"},
      {"id":"#E-5","type":"Employee", "name": "Kameshwaran"},
      {"id":"#E-6","type":"Employee", "name": "Gaurav sharma"},
      {"id":"#E-7","type":"Employee", "name": "Punit Gupta"},
      {"id":"#E-8","type":"Employee", "name": "Balram Kitchar"},
      {"id":"#E-9","type":"Employee", "name": "Arjun SNA"},
      {"id":"#E-10","type":"Employee", "name": "Vijay Karthik"},

      {"type": "oversees", "out": "#E-1", "in": "#1" },
      {"type": "oversees", "out": "#E-1", "in": "#2" },
      {"type": "oversees", "out": "#E-1", "in": "#3" },
      {"type": "consults", "out": "#E-5", "in": "#1" },
      {"type": "manages", "out": "#E-2", "in": "#1" },
      {"type": "engineers", "out": "#E-6", "in": "#1" },
      {"type": "engineers", "out": "#E-7", "in": "#1" },
      {"type": "engineers", "out": "#E-8", "in": "#1" },
      {"type": "manages", "out": "#E-4", "in": "#2" },
      {"type": "engineers", "out": "#E-9", "in": "#2" },
      {"type": "consults", "out": "#E-5", "in": "#2" },
      {"type": "consults", "out": "#E-3", "in": "#3" },
      {"type": "engineers", "out": "#E-10", "in": "#3" },
    ];
  });
}]);
