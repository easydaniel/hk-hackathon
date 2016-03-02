console.log( "ready!" );

/*var data = [
  {"sharedLabel": "Loli", "barData1": 43041, "barData2": 40852},
  {"sharedLabel": "yoman", "barData1": 38867, "barData2": 36296},
  {"sharedLabel": "goat", "barData1": 41748, "barData2": 40757},
  {"sharedLabel": "meat", "barData1": 24831, "barData2": 23624},
  {"sharedLabel": "Kevin-Chen", "barData1": 15764, "barData2": 15299},
  {"sharedLabel": "Daniel", "barData1": 17006, "barData2": 16071},
  {"sharedLabel": "allen-cat", "barData1": 24309, "barData2": 23235},
  {"sharedLabel": "toosyou", "barData1": 46756, "barData2": 46065},
  {"sharedLabel": "plant", "barData1": 41923, "barData2": 41704},
  {"sharedLabel": "water", "barData1": 42565, "barData2": 42159},
  {"sharedLabel": "bavarage", "barData1": 44316, "barData2": 45468},
  {"sharedLabel": "cake", "barData1": 42975, "barData2": 44223},
  {"sharedLabel": "car", "barData1": 36755, "barData2": 39452},
  {"sharedLabel": "boat", "barData1": 31578, "barData2": 34063},
  {"sharedLabel": "cloth", "barData1": 10328, "barData2": 11799},
  {"sharedLabel": "hat", "barData1": 13917, "barData2": 14949},
  {"sharedLabel": "shoe", "barData1": 7920, "barData2": 8589},
  {"sharedLabel": "man", "barData1": 9003, "barData2": 10397},
  {"sharedLabel": "book", "barData1": 14322, "barData2": 16832},
  {"sharedLabel": "hair", "barData1": 12369, "barData2": 15836},
  {"sharedLabel": "bed", "barData1": 8710, "barData2": 12377},
  {"sharedLabel": "haha", "barData1": 5853, "barData2": 12213}
];*/


d3.json("data/fake-data.json", function(error, json) {
  if (error) return console.warn("something error");

  var data = Object.keys(json.data).map(function(index){
  	return json.data[index];
  });

	var w = parseInt(d3.select(".content").style("width"), 10),
	    h = parseInt(d3.select(".content").style("height"), 10),
	    topMargin = 15,
	    labelSpace = 30 + w/100,
	    innerMargin = w/2+labelSpace,
	    outerMargin = 10,
	    gap = 10,
	    dataRange = d3.max(data.map(function(d) { console.log(d); return Math.max(d.barData1, d.barData2) }));
	    leftLabel = "America",
	    rightLabel = "China";

	/* edit with care */
	var chartWidth = w - innerMargin - outerMargin,
	    barWidth = h / data.length,
	    yScale = d3.scale.linear().domain([0, data.length]).range([0, h-topMargin]),
	    total = d3.scale.linear().domain([0, dataRange]).range([0, chartWidth - labelSpace]),
	    commas = d3.format(",.0f");

	/* main panel */
	var vis = d3.select("#vis").append("svg")
	    .attr("width", w)
	    .attr("height", h);

	/* barData1 title label */
	vis.append("text")
	  .attr("class", "firstlabel")
	  .text(leftLabel)
	  .attr("x", w-innerMargin)
	  .attr("y", topMargin-3)
	  .attr("text-anchor", "end");

	/* barData2 title label */
	vis.append("text")
	  .attr("class", "secondlabel")
	  .text(rightLabel)
	  .attr("x", innerMargin)
	  .attr("y", topMargin-3);

	/*female bars and data labels */
	var bar = vis.selectAll("g.bar")
	    .data(data)
	  	.enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d, i) {
	      return "translate(0," + (yScale(i) + topMargin) + ")";
	    });

	var wholebar = bar.append("rect")
		.attr("class", "singlebar")
	    .attr("width", w)
	    .attr("height", barWidth-gap)
	    .attr("fill", "none")
	    .attr("pointer-events", "all");

	var highlight = function(c) {
	  return function(d, i) {
	    bar.filter(function(d, j) {
	      return i === j;
	    }).attr("class", c);
	  };
	};
	bar
	  .on("mouseover", highlight("highlight bar"))
	  .on("mouseout", highlight("bar"));


	bar.append("text")
	    .attr("class", "shared")
	    .attr("x", w/2)
	    .attr("dy", "1em")
	    .attr("text-anchor", "middle")
	    .text(function(d) { return d.sharedLabel; });

	bar.append("rect")
	    .attr("class", "femalebar")
	    .attr("height", barWidth-gap)
	    .attr("x", function(d) { return innerMargin - total(d.barData2) - 2 * labelSpace;})
	    .attr("width", function(d) { return total(d.barData2)})

	bar.append("text")
	    .attr("class", "femalebar")
	    .attr("dx", -10)
	    .attr("dy", "1em")
	    .attr("text-anchor", "end");

	bar.append("rect")
	    .attr("class", "malebar")
	    .attr("height", barWidth-gap)
	    .attr("x", innerMargin)
	    .attr("width", function(d) { return total(d.barData1)})

	bar.append("text")
	    .attr("class", "malebar-text")
	    .attr("dx", 5)
	    .attr("dy", "1em")

	d3.select("#generate").on("click", function() {
	  for (var i=0; i<data.length; i++) {
	    data[i].barData1 = Math.random() * dataRange;
	    data[i].barData2 = Math.random() * dataRange;
	  }
	  refresh(data);
	});

refresh(data);

resize();
d3.select(window).on("resize", resize);
function resize() {

	w = parseInt(d3.select(".content").style("width"), 10);
    h = parseInt(d3.select(".content").style("height"), 10);
    labelSpace = 30 + w/100;
    innerMargin = w/2+labelSpace;

	/* edit with care */
	var chartWidth = w - innerMargin - outerMargin,
    barWidth = h / data.length,
    yScale = d3.scale.linear().domain([0, data.length]).range([0, h-topMargin]),
    total = d3.scale.linear().domain([0, dataRange]).range([0, chartWidth - labelSpace]),
    commas = d3.format(",.0f");


	console.log("yo this is w:" + w);
	console.log("yo this is h:" + h);
	console.log("yo this is labelSpace:" + labelSpace);
	console.log("yo this is innerMargin:" + innerMargin);

	var vis = d3.select("svg")
	    .attr("width", w)
	    .attr("height", h);

	/* barData1 title label */
	vis.select(".firstlabel")
	  .text(leftLabel)
	  .attr("x", w-innerMargin)
	  .attr("y", topMargin-3)
	  .attr("text-anchor", "end");

	/* barData2 title label */
	vis.select(".secondlabel")
	  .text(rightLabel)
	  .attr("x", innerMargin)
	  .attr("y", topMargin-3); 

	var bar = vis.selectAll("g.bar")
	    .attr("transform", function(d, i) {
	      return "translate(0," + (yScale(i) + topMargin) + ")";
	    });

	var wholebar = vis.selectAll(".singlebar")
	    .attr("width", w)
	    .attr("height", barWidth-gap)

	bar.selectAll(".shared")
	    .attr("x", w/2);

	bar.selectAll(".femalebar")
	    .attr("x", function(d) { return innerMargin - total(d.barData2) - 2 * labelSpace; })
	    .attr("width", function(d) { return total(d.barData2) })


	bar.selectAll(".malebar")
	    .attr("x", innerMargin)
	    .attr("width", function(d) { return total(d.barData1)})


	bar.selectAll(".malebar-text")
		.attr("x", function(d) { return innerMargin + total(d.barData1)})
	    .attr("dx", 5)
	    .attr("dy", "1em");

 }

function refresh(data) {
  var bars = d3.selectAll("g.bar")
      .data(data);

  bars.selectAll("rect.malebar")
    .transition()
      .attr("width", function(d) { return total(d.barData1);});
  bars.selectAll("rect.femalebar")
    .transition()
      .attr("x", function(d) { return innerMargin - total(d.barData2) - 2 * labelSpace; }) 
      .attr("width", function(d) { return total(d.barData2)});

  bars.selectAll("text.malebar-text")
      .text(function(d) { return commas(d.barData1); })
    .transition()
      .attr("x", function(d) { return innerMargin + total(d.barData1); });
  bars.selectAll("text.femalebar")
      .text(function(d) { return commas(d.barData2); })
    .transition()
      .attr("x", function(d) { return innerMargin - total(d.barData2) - 2 * labelSpace; });
}


});





