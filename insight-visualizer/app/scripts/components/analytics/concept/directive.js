(function(){

  var app = angular.module("polar.components.analytics.concept");

  app.directive("polarAnalyticsConcept", [function(){
    return{
      scope: {
        filters: "=",
      },
      replace: true,

      templateUrl: "app/scripts/components/analytics/concept/template.html",
      controller: "polar.components.analytics.concept.Controller",

      link: function($scope, element, attrs){

        function container(){
          return angular.element(element.find('.tag-cloud'))[0];
        };

        var color = d3.scale.linear()
            .domain([0,1,2,3,4,5,6,10,15,20,100])
            .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);


        function draw(words) {
            d3.select(container()).append("svg")
                    .attr("width", container().clientWidth)
                    .attr("height", 500)
                    .attr("class", "wordcloud")
                    .append("g")
                    // without the transform, words words would get cutoff to the left and top, they would
                    // appear outside of the SVG area
                    .attr("transform", "translate(650,200)")
                    .selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("font-size", function(d) { return d.size + "px"; })
                    .style("fill", function(d, i) { return color(i); })
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .text(function(d) { return d.text; });
        }

        $scope.$watch("tags", function(nv, ov){
          if(nv && nv.length > 0){
            // Clean
            angular.element(container()).find('svg').remove();

            d3.layout.cloud().size([container().clientWidth - 50, 450])
              .words($scope.tags)
              .rotate(0)
              .fontSize(function(d) { return d.size; })
              .on("end", draw)
              .start();
          };
        });
      }
    };
  }]);

}());
