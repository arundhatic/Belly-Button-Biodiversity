
function buildMetadata(sample) {
    d3.json("data/samples.json").then(importedData =>{

     var objs = importedData.metadata;
     //console.log("objs", objs);

     var matchedSampleObj = objs.filter(sampleData => sampleData["id"] === parseInt(sample));
     //console.log("matchedSampleObj", matchedSampleObj);

      var dataSelector = d3.select('#sample-metadata');
      dataSelector.html("");

      Object.entries(matchedSampleObj[0]).forEach(([key,value]) =>{
        dataSelector.append('h6').text(`${key} : ${value}`)
    });

  })

}

function convertAsString(val) {
  return "OTU " + val.toString();
}

function barChart(data){

    data.sample_values.sort((a, b) => b - a);

    let otu_ids = data.otu_ids.slice(0,10);
    let otu_labels = data.otu_labels.slice(0,10);
    let sample_values = data.sample_values.slice(0,10);

    //console.log("otu_ids", otu_ids);
    //console.log("otu_labels", otu_labels);
    //console.log("sample_values", sample_values)

    let yAxis = otu_ids.map(convertAsString)
    //.log ("yAxis", yAxis);

    let trace = [{
      x: sample_values.reverse(),
      y: yAxis.reverse(),
      text: otu_labels.reverse(),
      type: "bar",
      orientation: "h"
      
    }];

    let layout = {
        title: '<b>Belly Button Bar Chart</b>',

      };

      Plotly.newPlot('bar', trace , layout, {responsive: true});
}

function bubbleChart(data) {

  let x = data.otu_ids;
  let y = data.sample_values;
  let markersize = data.sample_values;
  let markercolors = data.otu_ids;
  let textvalues = data.otu_labels;

  let trace =[{
    x: x,
    y: y,
    mode: 'markers',
    marker: {
      size: markersize,
      color: markercolors,
    },
    text: textvalues
  }];

  let layout = {
    title:"<b>Belly Button Bubble Chart</b>",
    xaxis: {
      title: 'OTU ID',
    },
    yaxis: {
      title: 'Sample Value'
    },
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
  };

  Plotly.newPlot('bubble', trace, layout, {responsive: true});
}

function gaugeChart(data) {

  let degree = parseInt(data.wfreq) * (180/10);

  // Trig to calc meter point
  let degrees = 180 - degree;
  let radius = .5;
  let radians = degrees * Math.PI / 180;
  let x = radius * Math.cos(radians);
  let y = radius * Math.sin(radians);

  let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  let path = mainPath.concat(pathX,space,pathY,pathEnd);

  let trace = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'WASH FREQ',
      text: data.wfreq,
      hoverinfo: 'text+name'},
    { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
    textinfo: 'text',
    textposition:'inside',
    textfont:{
      size : 16,
      },
    marker: {colors:['rgba(6, 51, 0, .5)', 'rgba(9, 77, 0, .5)', 
                           'rgba(12, 102, 0 ,.5)', 'rgba(14, 127, 0, .5)',
                           'rgba(110, 154, 22, .5)','rgba(170, 202, 42, .5)', 
                           'rgba(202, 209, 95, .5)','rgba(210, 206, 145, .5)', 
                           'rgba(232, 226, 202, .5)','rgba(255, 255, 255, 0)'
                    ]},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
    hoverinfo: 'text',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  let layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],

    title: '<b>Belly Button Washing Frequency</b> <br> <b>Scrub Per Week</b>',
    height: 550,
    width: 550,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
  };

  Plotly.newPlot('gauge', trace, layout, {responsive: true});
}


function buildCharts(sample) {

  d3.json("data/samples.json").then(importedData =>{
    var objs = importedData.samples;
    //console.log("objs", objs);

    var matchedSampleObj = objs.filter(sampleData => sampleData["id"] === sample);
   // console.log("matchedSampleObj", matchedSampleObj);
      // bar Chart
      barChart(matchedSampleObj[0]);

      // Bubble Chart 
      bubbleChart(matchedSampleObj[0]);

    });
   
}

// build gauge chart
function buildGaugeChart(sample) {

  d3.json("data/samples.json").then(importedData =>{

    var objs = importedData.metadata;
    //console.log("objs", objs);

    var matchedSampleObj = objs.filter(sampleData => sampleData["id"] === parseInt(sample));
    //console.log("buildGaugeChart matchedSampleObj", matchedSampleObj);

    gaugeChart(matchedSampleObj[0]);

 });
   
}

function init() {
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("data/samples.json").then(importedData => {

    var sampleNames = importedData["names"];
    //console.log("sampleNames", sampleNames)

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
    buildGaugeChart(firstSample)
    
  });
}

function optionChanged(newSample) {
  // get new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  buildGaugeChart(newSample)
 
}

// initialize the dashboard
init();