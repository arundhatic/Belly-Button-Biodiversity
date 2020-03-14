
function buildMetadata(sample) {
    d3.json("data/samples.json").then(importedData =>{

     var objs = importedData.metadata;
     console.log("objs", objs);

     var matchedSampleObj = objs.filter(sampleData => sampleData["id"] === parseInt(sample));
     console.log("matchedSampleObj", matchedSampleObj);

      var dataSelector = d3.select('#sample-metadata');
      dataSelector.html("");

      Object.entries(matchedSampleObj[0]).forEach(([key,value]) =>{
        dataSelector.append('h6').text(`${key} : ${value}`)
        .append('hr')
    });

  })

}


function convertAsString(val) {
  return "OTU " + val.toString();
}

function barChart(data){

    // Sort the data array using the greekSearchResults value
    data.sample_values.sort((a, b) => b - a);

    const otu_ids = data.otu_ids.slice(0,10);
    const otu_labels = data.otu_labels.slice(0,10);
    const sample_values = data.sample_values.slice(0,10);

    console.log("otu_ids", otu_ids);
    console.log("otu_labels", otu_labels);
    console.log("sample_values", sample_values)

    const yAxis = otu_ids.map(convertAsString)
    console.log ("yAxis", yAxis);

    let trace = [{
      x: sample_values.reverse(),
      y: yAxis.reverse(),
      text: otu_labels.reverse(),
      type: "bar",
      orientation: "h"
      
    }];

    let layout = {
        title: '<b> Belly Button Bar Chart </b>',

      };

      Plotly.newPlot('bar', trace , layout, {responsive: true});
}

function buildCharts(sample) {

  d3.json("data/samples.json").then(importedData =>{
    var objs = importedData.samples;
    console.log("objs", objs);

    var matchedSampleObj = objs.filter(sampleData => sampleData["id"] === sample);
    console.log("matchedSampleObj", matchedSampleObj);
      // ## bar Chart ##
      barChart(matchedSampleObj[0]);
    });
   
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("data/samples.json").then(importedData => {

    var sampleNames = importedData["names"];
    console.log("sampleNames", sampleNames)

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
    
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
 
}

// Initialize the dashboard
init();