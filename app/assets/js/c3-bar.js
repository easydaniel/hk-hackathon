console.log("ready!");
var totalMonth;
var tempMonthData;
var importData, exportData;
var data;
var dataOfTotalMoney;

var rng;
var rng_NOW_STATE;

var theYear;
var theMonth;

var nowHover = {};
var nowclick;
var DANIEL_CALL_IT_state = 0;

var Input_Output_state;

$.ajax({
  url: "http://140.113.89.72:1337/out",
  type: "GET",
  dataType: "json",
  success: function(Jdata) {
    exportData = Jdata;
  },
  error: function() {
    console.log("outport ERROR!!!");
  }

});

$.ajax({
  url: "http://140.113.89.72:1337/test",
  type: "GET",
  dataType: "json",
  success: function(Jdata) {
    importData = Jdata;
  },
  error: function() {
    console.log("import ERROR!!!");
  }

});

$(".import").on("click", function(){

  Input_Output_state = 0;

  $(this).addClass('active');
  $('.export').removeClass('active');
  drow(importData);
});

$(".export").on("click", function(){

  Input_Output_state = 1;

  $(this).addClass('active');
  $('.import').removeClass('active');
  drow(exportData);
});

function drow(Daniel_told_me_this_is_data){

  totalMonth = Daniel_told_me_this_is_data;

  d3.select("svg").remove();
  data = totalMonth[0].data;
  data = takeOutTotalMoney(data);

  cleanData(data);

  var w = parseInt(d3.select(".content").style("width"), 10),
    h = 20 * data.length,
    topMargin = 50,
    labelSpace = 30 + w / 100,
    innerMargin = w / 2 + labelSpace,
    outerMargin = 20,
    dataRange = d3.max(data.map(function(d) {
      return Math.max(d.america, d.china)
    }));
    leftLabel = "America",
    rightLabel = "China";

    if(Input_Output_state === 0){
      dataRange = 5000;
    }else{
      dataRange = 200;
    }
  
  /* edit with care */
  var chartWidth = w - innerMargin - outerMargin,
    barWidth = h / data.length,
    yScale = d3.scale.linear().domain([0, data.length]).range([0, h - topMargin]),
    total = d3.scale.sqrt().domain([0, dataRange]).range([0, chartWidth - labelSpace]).clamp(true),
    commas = d3.format(",.0f"),
    gap = barWidth * 0.4;

  /* main panel */
  var vis = d3.select("#vis").append("svg")
    .attr("width", w)
    .attr("height", h);

  /* barData1 title label */
  vis.append("text")
    .attr("class", "leftlabel")
    .text(leftLabel)
    .attr("x", w - innerMargin - 5)
    .attr("y", topMargin - 3)
    .attr("dy", -5)
    .attr("text-anchor", "end");

  vis.append("text")
    .attr("class", "totalmoney")
    .text(dataOfTotalMoney.america)
    .attr("x", w - innerMargin - 50)
    .attr("y", topMargin - 3)
    .attr("dy", -5)
    .attr("text-anchor", "end");

  /* barData2 title label */
  vis.append("text")
    .attr("class", "totalmoney")
    .text(dataOfTotalMoney.china)
    .attr("x", innerMargin + 50)
    .attr("y", topMargin - 3)
    .attr("dy", -5);

  /* barData2 title label */
  vis.append("text")
    .attr("class", "rightlabel")
    .text(rightLabel)
    .attr("x", innerMargin + 5)
    .attr("y", topMargin - 3)
    .attr("dy", -5);



  var singleDataChart = c3.generate({
    bindto: '#singleItem',
    data: {
      columns: [
        // ['America', nowHover.america],
        // ['China', nowHover.china],
      ],
      colors: {
        America: '#247BA0',
        China: '#F25F5C'

      },
      type: 'donut',
      onmouseover: function(d, i) {
      },
      onmouseout: function(d, i) {
      }
    },
    donut: {
      //title: nowHover.america
    }
  });
  singleDataChart.resize({
    height: 300,
    width: 300
  });


  var trendChart = c3.generate({
    bindto: '#trend',
    data: {
      x: "x",
      columns: [
      ],
      types: {
        America: 'area-spline',
        China: 'area-spline'
      },
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m'
        }
      }
    },
    point: {
      r: 5
    }
  });

  var highlight = function(c) {
    return function(d, i) {
      bar.filter(function(d, j) {
        return i === j;
      }).attr("class", c);


      nowHover = d;
      $(this).click(function() {
        
        nowclick = d;

        singleDataChart.load({
          columns: [
            ['America', nowclick.america],
            ['China', nowclick.china],
          ]
        });

        document.querySelector("#itemName").innerHTML = nowclick.name;
        document.querySelector("#trendName").innerHTML = nowclick.name;
        /* detect for font size*/
        var fontSize = $('#trendName'),
            textLength = fontSize.text().length;
        //console.log(textLength);
        if(textLength > 30) {
            fontSize.css('font-size', '1.4em');
        } else if(textLength > 20) {
            fontSize.css('font-size', '2em');
        } else if(textLength > 10) {
            fontSize.css('font-size', '3em');
        }
        //bar.on("click", highlight("click-highlight bar"))

     var trendAmerica = ["America"].concat(totalMonth.map(function(item) {
          var f = item.data.find(function(i) {
            return i.name === nowclick.name;
          })
          return f === 'undefined' ? 0 : parseFloat(f.america.toString().replace(',', ''));
        }));
        var trendChina = ["China"].concat(totalMonth.map(function(item) {
          var f = item.data.find(function(i) {
            return i.name === nowclick.name;
          })
          return f === 'undefined' ? 0 : parseFloat(f.china.toString().replace(',', ''));
        }));

        var timeline = ["x"].concat(totalMonth.map(function(item) {
          return item.year + "-" + item.month + "-01";
        }))

        trendChart.load({
          columns: [
            timeline,
            trendAmerica,
            trendChina,
          ],
          colors: {
            America: '#247BA0',
            China: '#F25F5C',
          },
          point:{
            r:3,
            focus:{
              expand:{
                r:3.5
              }
            }
          }
        })
      });
    };
  };

  refresh('america');
  resize();
  d3.select(window).on("resize", resize);

  function resize() {

    w = parseInt(d3.select(".content").style("width"), 10);
    h = 20 * data.length;
    labelSpace = 30 + w / 100;
    innerMargin = w / 2 + labelSpace;

    if(Input_Output_state === 0){
      dataRange = 5000;
    }else{
      dataRange = 200;
    }
    /* edit with care */
    var chartWidth = w - innerMargin - outerMargin,
      barWidth = h / data.length,
      yScale = d3.scale.linear().domain([0, data.length]).range([0, h - topMargin]),
      total = d3.scale.sqrt().domain([0, dataRange]).range([0, chartWidth - labelSpace]).clamp(true),
      commas = d3.format(",.0f");
      gap = barWidth * 0.4;

    var vis = d3.select("svg")
      .attr("width", w)
      .attr("height", h);

    /* barData1 title label */
    vis.select(".leftlabel")
      .text(leftLabel)
      .attr("x", innerMargin - labelSpace - 10)
      .attr("y", topMargin - 3)
      .attr("text-anchor", "end");

    /* barData2 title label */
    vis.select(".rightlabel")
      .text(rightLabel)
      .attr("x", innerMargin - labelSpace + 10)
      .attr("y", topMargin - 3)

    var wholebar = vis.selectAll(".onebar")
      .attr("width", w)
      .attr("height", barWidth - gap);

    bar = vis.selectAll("g.bar")
      .attr("transform", function(d, i) {
        return "translate(0," + (yScale(i) + topMargin) + ")";
      });

    bar.selectAll(".shared")
      .text(function(d) {
        return d.name;
      });

    bar.selectAll(".leftbar")
      .attr("x", function(d) {
        return innerMargin - total(d.america) - 1 * labelSpace;
      })
      .attr("width", function(d) {
        return total(d.america)
      })
      .attr("height", barWidth - gap);

    bar.selectAll(".leftbar-text")
      .attr("x", function(d) {
        return innerMargin - total(d.america) - 1 * labelSpace;
      })
      .attr("dx", -10)

    bar.selectAll(".rightbar")
      .attr("x", function(d) {
        return innerMargin - 1 * labelSpace;
      })
      .attr("width", function(d) {
        return total(d.china)
      })
      .attr("height", barWidth - gap);


    bar.selectAll(".rightbar-text")
      .attr("x", function(d) {
        return innerMargin + total(d.china) - 1 * labelSpace;
      })
      .attr("dx", 10)
  }

  function refresh(tag) { 
    sortedData = [];
    if (tag === 'america') {
        sortedData = data.sort(function(i, j) {
          return j.america - i.america;
        });
    } else if (tag == 'china') {
        sortedData = data.sort(function(i, j) {
          return j.china - i.china;
        });
    }
    else { sortedData = data; }

    var bars = d3.selectAll("g.bar");
    bars.remove();
    var money = d3.selectAll(".totalmoney");
    money.remove();
    /*female bars and data labels */
    vis.append("text")
      .attr("class", "totalmoney")
      .text(dataOfTotalMoney.america)
      .attr("x", innerMargin - labelSpace - 180)
      .attr("y", topMargin - 3)
      .attr("dy", -8)
      .attr("text-anchor", "end");

    /* barData2 title label */
    vis.append("text")
      .attr("class", "totalmoney")
      .text(dataOfTotalMoney.china)
      .attr("x", innerMargin - labelSpace + 120)
      .attr("y", topMargin - 3)
      .attr("dy", -8);

    var bar = vis.selectAll("g.bar")
      .data(sortedData)
      .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) {
        return "translate(0," + (yScale(i)*2 + topMargin) + ")";
      })

    var wholebar = bar.append("rect")
      .attr("class", "onebar")
      .attr("width", w)
      .attr("height", barWidth - gap)
      .attr("fill", "none")
      .attr("pointer-events", "all")
    bar
      .on("mouseover", highlight("highlight bar"))
      .on("mouseout", highlight("bar"));
    
     bar.append("text")
         .attr("class", "shared")
         .attr("x", w/2)
         .attr("text-anchor", "middle")
         .text(function(d) { return d.name; });

    bar.append("rect")
      .attr("class", "leftbar")
      .attr("height", barWidth - gap)
      .attr("x", function(d) {
        return innerMargin - total(d.america) - 2 * labelSpace;
      })
      .attr("width", function(d) {
        return total(d.america)
      })

    bar.append("rect")
      .attr("class", "rightbar")
      .attr("height", barWidth - gap)
      .attr("x", innerMargin)
      .attr("width", function(d) {
        return total(d.china)
      })

    bar.append("text")
      .attr("class", "leftbar-text")
      .attr("dx", -10)
      .attr("dy", ".65em")
      .attr("text-anchor", "end")
      .text(function(d) {
        return d.america;
      });

    bar.append("text")
      .attr("class", "rightbar-text")
      .attr("dx", 5)
      .attr("dy", ".65em")
      .text(function(d) {
        return d.china;
      });
    if(DANIEL_CALL_IT_state === 0){
      d3.select(".leftlabel").style("stroke", "#FFE066");
      d3.select('.rightlabel').style("stroke", "#474B54");
    } else{
      d3.select(".rightlabel").style("stroke", "#FFE066");
      d3.select('.leftlabel').style("stroke", "#474B54");
    }

    resize();
  }

  d3.select(".rightlabel").on("click", function(e) {
    DANIEL_CALL_IT_state = 1;
    refresh('china');
  });

  d3.select(".leftlabel").on("click", function(e) {
    DANIEL_CALL_IT_state = 0;
    refresh('america');
  });

  rng = document.querySelector("#monthTime");
  rng_NOW_STATE = 1000;
  read("mousedown");
  read("mousemove");

  function read(evtType) {
    rng.addEventListener(evtType, function() {
      if(rng_NOW_STATE === rng.value){

      }else{
        rng_NOW_STATE = rng.value;

        data = totalMonth[rng.value].data;
        theYear = totalMonth[rng.value].year;
        theMonth = totalMonth[rng.value].month;
        cleanData(data);
        data = takeOutTotalMoney(data);

        window.requestAnimationFrame(function() {
          document.querySelector("#showTimebyJSON").innerHTML = theYear + "-" + theMonth;
        });

        if(DANIEL_CALL_IT_state === 0){
          refresh('america'); 
        }else{
          refresh('china'); 
        }
      }
    });
    
  }

  function cleanData(data) {
    for (var i = 0; i < data.length; i++) {
      data[i].america = parseFloat(data[i].america.toString().replace(',', ''));
      data[i].china = parseFloat(data[i].china.toString().replace(',', ''));

      if (isNaN(data[i].america) || data[i].america == -1) {
        data[i].america = 0;
      }
      if (isNaN(data[i].china) || data[i].china == -1) {
        data[i].china = 0;
      }
    }
  };

  function takeOutTotalMoney(data){
    var tempdata = data.filter(function(d) {if(d.name!=='商品總值'){return d}
                                            else{dataOfTotalMoney = d;};})
    return tempdata;
  }
}

//good background : 0 , 3, 5,  
var t = new Trianglify({
  x_gradient: ["#ffffbf","#abdda4","#2b83ba"],
  noiseIntensity: 0,
  cellsize: 130
});
var pattern = t.generate(window.innerWidth, window.innerWidth*2);
document.body.setAttribute('style', 'background-image: '+ pattern.dataUrl);
