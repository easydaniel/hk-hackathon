var dataset = [];

for(var i = 0; i < 20; i++){
    var num = 5 + Math.floor(Math.random()*30);
    dataset.push(num);
}

d3.select('body').selectAll('div')
        .data(dataset)
        .enter()
        .append('div')
        .attr('class','bar')
        .style('height',function(d){
          return (d*3) + 'px';
        })