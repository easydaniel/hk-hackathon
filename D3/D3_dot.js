var w = 600;
var h = 250;

var dataset = [];
for(var i = 0; i < 20; i++){
	var num1 = 5 + Math.floor(Math.random() *480);
	var num2 = 5 + Math.floor(Math.random() *230);
	dataset.push([num1,num2]);
}
console.log(dataset);
var svg = d3.select('body').append('svg').attr({'width':w, 'height':h})

svg.selectAll('circle').data(dataset).enter()
.append('circle')
.attr({
	'cx':function(d){return d[0] + 10},
	'cy':function(d){return d[1] + 10},
	'r': function(d){return Math.sqrt(h - d[1])},
	'fill': function(d){return d3.hsl(d[0]% 360, .6, .6)}
});

svg.selectAll('text').data(dataset).enter()
.append('text')
.text(function(d){return d[0]+ ',' +d[1]}).attr({
	'x': function(d){return d[0] + 10},
	'y': function(d){return d[1] + 10},
	'fill': 'red',
	'font-size': '10px',
	'font-family':'cursive'
});
