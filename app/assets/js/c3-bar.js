console.log("ready!");
var totalMonth;
var tempMonthData;
var data;
var rng;
var theYear;
var theMonth;
var nowHover = {};
var nowclick;
var DANIEL_CALL_IT_state = {};

$.ajax({
  url: "http://140.113.89.72:1337/test",
  type: "GET",
  dataType: "json",

  success: function(Jdata) {
    // console.log("SUCCESS!!!" + Jdata);
    totalMonth = Jdata;

    data = totalMonth[0].data;


    cleanData(data);
    data= data.sort(function(i, j) {
      return j.america - i.america;
    });

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
    dataRange = 2500;
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

    /* barData2 title label */
    vis.append("text")
      .attr("class", "rightlabel")
      .text(rightLabel)
      .attr("x", innerMargin + 5)
      .attr("y", topMargin - 3)
      .attr("dy", -5);

    /*female bars and data labels */
    var bar = vis.selectAll("g.bar")
      .data(data)
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
      //.on('click', function(d,i){ d3.select(this).style("fill", "red"); });

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
        //onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function(d, i) {
          // console.log("fuck", d, i);
        },
        onmouseout: function(d, i) {
          // console.log("onmouseout", d, i);
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

       var trendAmerica = ["America"].concat(Jdata.map(function(item) {
            var f = item.data.find(function(i) {
              return i.name === nowclick.name;
            })
            return f === 'undefined' ? 0 : parseFloat(f.america.toString().replace(',', ''));
          }));
          var trendChina = ["China"].concat(Jdata.map(function(item) {
            var f = item.data.find(function(i) {
              return i.name === nowclick.name;
            })
            return f === 'undefined' ? 0 : parseFloat(f.china.toString().replace(',', ''));
          }));

          var timeline = ["x"].concat(Jdata.map(function(item) {
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
    bar
      .on("mouseover", highlight("highlight bar"))
      .on("mouseout", highlight("bar"));
    
     bar.append("text")
         .attr("class", "shared")
         .attr("x", w/2)
         //.attr("dy", barWidth/2)
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

    /*d3.select(".rightlabel").on("click", function() {
      console.log("yo");
      tempMonthData = data;
      sortDatabyChina(tempMonthData);
        for (var i=0; i<data.length; i++) {
          data[i].america = tempMonthData[i].america;
          data[i].china = tempMonthData[i].china;
        }
      refresh(data);
    });*/


    resize();
    d3.select(window).on("resize", resize);

    function resize() {

      w = parseInt(d3.select(".content").style("width"), 10);
      h = 20 * data.length;
      labelSpace = 30 + w / 100;
      innerMargin = w / 2 + labelSpace;
      dataRange = 2500;
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
        .attr("x", w - innerMargin - 5)
        .attr("y", topMargin - 3)
        .attr("text-anchor", "end")
        .on("click", handleClick);

      /* barData2 title label */
      vis.select(".rightlabel")
        .text(rightLabel)
        .attr("x", innerMargin + 5)
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

      d3.select(".rightlabel").on("click", function(e) {
        d3.select(this).style("fill", "#FFE066");
        d3.select('.leftlabel').style("fill", "#474B54");
        refresh('china');
      });

      d3.select(".leftlabel").on("click", function(e) {
        d3.select(this).style("fill", "#FFE066");
        d3.select('.rightlabel').style("fill", "#474B54");
        refresh('america');
      });
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
      /*female bars and data labels */
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
        //.on('click', function(d,i){ d3.select(this).style("fill", "red"); });
      bar
        .on("mouseover", highlight("highlight bar"))
        .on("mouseout", highlight("bar"));
      
       bar.append("text")
           .attr("class", "shared")
           .attr("x", w/2)
           //.attr("dy", barWidth/2)
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
        resize();
    }

    rng = document.querySelector("#monthTime");

    read("mousedown");
    read("mousemove");

    function read(evtType) {
      rng.addEventListener(evtType, function() {
        //window.requestAnimationFrame(function () {
        //  document.querySelector("#showTime").innerHTML = rng.value;
        //});
        console.log(rng.value);

        data = totalMonth[rng.value].data;
        theYear = totalMonth[rng.value].year;
        theMonth = totalMonth[rng.value].month;
        cleanData(data);

        setTimeout(function(){refresh(data);}, 100);

        window.requestAnimationFrame(function() {
          document.querySelector("#showTimebyJSON").innerHTML = theYear + "-" + theMonth;
        });
        
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
    }

    function handleClick(d, i) {
          d3.select(this).classed("highlight-label", !d3.select(this).classed("highlight-label"));
        }

  },
  error: function() {
    console.log("ERROR!!!");
  }
});
