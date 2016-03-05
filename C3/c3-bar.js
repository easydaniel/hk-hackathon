console.log( "ready!" );
var totalMonth;
var tempMonth;
var data;
var rng;
var theYear;
var theMonth;
var nowHover = {};

$.ajax({
  url: "http://140.113.89.72:1337/test",
  type: "GET",
  dataType: "json",

  success: function(Jdata) {
    console.log("SUCCESS!!!" + Jdata);
    totalMonth = Jdata;

    data = totalMonth[0].data;
	var w = parseInt(d3.select(".content").style("width"), 10),
	    h = /*20 * data.length*/ parseInt(d3.select(".content").style("height"), 10),
	    topMargin = 15,
	    labelSpace = 30 + w/100,
	    innerMargin = w/2+labelSpace,
	    outerMargin = 20,
	    dataRange = d3.max(data.map(function(d) {return Math.max(d.america, d.china) }));
	    leftLabel = "America",
	    rightLabel = "China";
	    dataRange = 2500;
	/* edit with care */
	var chartWidth = w - innerMargin - outerMargin,
	    barWidth = h / 30,
	    yScale = d3.scale.linear().domain([0, data.length]).range([0, h-topMargin]),
	    total = d3.scale.sqrt().domain([0, dataRange]).range([0, chartWidth - labelSpace]).clamp(true),
	    commas = d3.format(",.0f"),
	    gap = barWidth*0.2;
	/* main panel */
	var vis = d3.select("#vis").append("svg")
	    .attr("width", w)
	    .attr("height", h);

	/* barData1 title label */
	vis.append("text")
	  .attr("class", "leftlabel")
	  .text(leftLabel)
	  .attr("x", w-innerMargin-5)
	  .attr("y", topMargin-3)
	  .attr("text-anchor", "end");

	/* barData2 title label */
	vis.append("text")
	  .attr("class", "rightlabel")
	  .text(rightLabel)
	  .attr("x", innerMargin+5)
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
		.attr("class", "onebar")
	    .attr("width", w)
	    .attr("height", barWidth-gap)
	    .attr("fill", "none")
	    .attr("pointer-events", "all");

	var highlight = function(c) {
	  return function(d, i) {
	    bar.filter(function(d, j) {
	      return i === j;
	    }).attr("class", c);

	    nowHover = d;
	    //console.log(nowHover.name + ", America:" + nowHover.america + " ," + nowHover.china );

		var singleDataChart = c3.generate({
			bindto: '#singleItem',
		    data: {
		        columns: [
		            ['America', nowHover.america],
		            ['China', nowHover.china],
		        ],
		        colors: {
		            America: '#247BA0',
		            China: '#F25F5C'
		        },
		        type : 'donut',
		        //onclick: function (d, i) { console.log("onclick", d, i); },
		        //onmouseover: function (d, i) { console.log("onmouseover", d, i); },
		        //onmouseout: function (d, i) { console.log("onmouseout", d, i); }
		    },
		    donut: {
		        title: nowHover.name
		    }
		});	
		singleDataChart.resize({height:300, width:300});

		d3.select(".c3-chart-arcs-title").attr('y',170);

	  };
	};
	bar
	  .on("mouseover", highlight("highlight bar"))
	  .on("mouseout", highlight("bar"));

	sortDatabyAmerica();
	bar.append("text")
	    .attr("class", "shared")
	    .attr("x", w/2)
	    //.attr("dy", barWidth/2)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return d.name; });

	bar.append("rect")
	    .attr("class", "leftbar")
	    .attr("height", barWidth-gap)
	    .attr("x", function(d) { return innerMargin - total(d.america) - 2 * labelSpace;})
	    .attr("width", function(d) { return total(d.america)})

	bar.append("rect")
	    .attr("class", "rightbar")
	    .attr("height", barWidth-gap)
	    .attr("x", innerMargin)
	    .attr("width", function(d) { return total(d.china)})

	bar.append("text")
	    .attr("class", "leftbar-text")
	    .attr("dx", -10)
	    .attr("dy", "1em")
	    .attr("text-anchor", "end")
	    .text(function(d) { return d.america; });

	bar.append("text")
	    .attr("class", "rightbar-text")
	    .attr("dx", 5)
	    .attr("dy", "1em")
	    .text(function(d) { return d.china; });

	d3.select("#generate").on("click", function() {
	  for (var i=0; i<data.length; i++) {
	    data[i].america = Math.random() * dataRange;
	    data[i].china = Math.random() * dataRange;
	  }
	  refresh(data);
	});

	d3.select("#year1").on("click", function() {
		var tempMonthData = totalMonth[0].data;	
	  for (var i=0; i<tempMonthData.length; i++) {
	    data[i].america = tempMonthData[i].america;
	    data[i].china = tempMonthData[i].china;
	  }
	  refresh(data);
	});
	d3.select("#year2").on("click", function() {
		var tempMonthData = totalMonth[1].data;	
	  for (var i=0; i<tempMonthData.length; i++) {
	    data[i].america = tempMonthData[i].america;
	    data[i].china = tempMonthData[i].china;
	  }
	  refresh(data);
	});

	refresh(data);

	resize();
	d3.select(window).on("resize", resize);
	function resize() {

		w = parseInt(d3.select(".content").style("width"), 10);
	    h = /*15 * data.length*/ parseInt(d3.select(".content").style("height"), 10);
	    labelSpace = 30 + w/100;
	    innerMargin = w/2+labelSpace;
	    dataRange = 2500;
		/* edit with care */
		var chartWidth = w - innerMargin - outerMargin,
	    barWidth = h / 30,
	    yScale = d3.scale.linear().domain([0, data.length]).range([0, h-topMargin]),
	    total = d3.scale.sqrt().domain([0, dataRange]).range([0, chartWidth - labelSpace]).clamp(true),
	    commas = d3.format(",.0f");
	    gap = barWidth*0.2;

		//console.log("yo this is w:" + w);
		console.log("yo this is h:" + h);
		//console.log("yo this is labelSpace:" + labelSpace);
		//console.log("yo this is innerMargin:" + innerMargin);
		console.log("yo this is barWidth:" + barWidth);

		var vis = d3.select("svg")
		    .attr("width", w)
		    .attr("height", h);

		/* barData1 title label */
		vis.select(".leftlabel")
		  .text(leftLabel)
		  .attr("x", w-innerMargin-5)
		  .attr("y", topMargin-3)
		  .attr("text-anchor", "end");

		/* barData2 title label */
		vis.select(".rightlabel")
		  .text(rightLabel)
		  .attr("x", innerMargin+5)
		  .attr("y", topMargin-3); 

		var wholebar = vis.selectAll(".onebar")
		    .attr("width", w)
		    .attr("height", barWidth-gap);

		sortDatabyAmerica();
		bar = vis.selectAll("g.bar")
		    .attr("transform", function(d, i) {
		      return "translate(0," + (yScale(i) + topMargin) + ")";
		    });

		bar.selectAll(".shared")
		    .attr("x", w/2)
		    //.attr("dy", barWidth/2);
			.text(function(d) { return d.name; });

		bar.selectAll(".leftbar")
		    .attr("x", function(d) { return innerMargin - total(d.america) - 1 * labelSpace; })
		    .attr("width", function(d) { return total(d.america) })
		    .attr("height", barWidth-gap);

		bar.selectAll(".leftbar-text")
		    .attr("x", function(d) { return innerMargin - total(d.america) - 1 * labelSpace; })
		    .attr("dx", -10)

		bar.selectAll(".rightbar")
		    .attr("width", function(d) { return total(d.china)})
		    .attr("x", function(d) { return innerMargin - 1 * labelSpace; }) 
		    .attr("height", barWidth-gap);


		bar.selectAll(".rightbar-text")
			.attr("x", function(d) { return innerMargin + total(d.china) - 1 * labelSpace;})
		    .attr("dx", 10)
		    .attr("dy", "1em");

	}
	function refresh(data) {
		//console.log(data);
	  var bars = d3.selectAll("g.bar")
	      .data(data);

	  bars.selectAll("rect.leftbar")
	    .transition()
	      .attr("x", function(d) { return innerMargin - total(d.america) - 1 * labelSpace; }) 
	      .attr("width", function(d) { return total(d.america)});
	  bars.selectAll("rect.rightbar")
	    .transition()
	      .attr("x", function(d) { return innerMargin - 1 * labelSpace; }) 
	      .attr("width", function(d) { return total(d.china);});


	  bars.selectAll("text.leftbar-text")
	      .text(function(d) { return commas(d.america); })
	    .transition()
	      .attr("x", function(d) { return innerMargin - total(d.america) - 1 * labelSpace; })
	  bars.selectAll("text.rightbar-text")
	      .text(function(d) { return commas(d.china); })
	    .transition()
	      .attr("x", function(d) { return innerMargin + total(d.china) - 1 * labelSpace;; });
	}

	rng = document.querySelector("#monthTime");

	read("mousedown");
	read("mousemove");

	function read(evtType) {
	  rng.addEventListener(evtType, function() {
	    //window.requestAnimationFrame(function () {
	    //  document.querySelector("#showTime").innerHTML = rng.value;
	    //});

	    var tempMonthData = totalMonth[rng.value].data;
	    theYear = totalMonth[rng.value].year;
	    theMonth = totalMonth[rng.value].month;

	    window.requestAnimationFrame(function () {
	      document.querySelector("#showTimebyJSON").innerHTML = theYear + "-" + theMonth;
	    });

	  	for (var i=0; i<tempMonthData.length; i++) {
	    	data[i].america = tempMonthData[i].america;
	    	data[i].china = tempMonthData[i].china;
	  	}
	  	refresh(data);

	  });
	}

	function sortDatabyAmerica(data) {
		data.sort(function(a, b) {
    		return parseFloat(b.america) - parseFloat(a.america);
		});
		console.log(data);
		refresh(data);
	}
	function sortDatabyChina() {

	}

  },
  error: function() {
    console.log("ERROR!!!");
  }
});


/*d3.json("data/fake-data.json", function(error, json) {
  if (error) return console.warn("something error");

  var data = Object.keys(json.data).map(function(index){
  	return json.data[index];
  });*/



//});


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



