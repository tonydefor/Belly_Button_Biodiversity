function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  buildGaugeChart(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var resultArray = data.samples.filter(sampleObj => 
      {return sampleObj.id == sample
    });
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    
    
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    // Printing on console to double check data retreival
    console.log(result);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
  
  // Data for bar chart
    var top_ten_otu_ids = result.otu_ids.slice(0, 10).map(numericIds => {
      return 'OTU ' + numericIds;
    }).reverse();
    
    var top_ten_sample_values = result.sample_values.slice(0, 10).reverse();
    var top_ten_otu_labels = result.otu_labels.slice(0, 10).reverse();
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks =  top_ten_otu_ids;



    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: top_ten_sample_values,  
        y: yticks,
        text: top_ten_otu_labels,
        name: "Top 10",
        type: 'bar',
        orientation: 'h'
      }
    ];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };

    // 10. Use Plotly to plot the bar chart data with the layout. 
    Plotly.newPlot('bar', barData, barLayout)
    
    // 11. Data for bubble chart
   
    var otu_ids = result.otu_ids.map(numericIds => {
      return numericIds;
    }).reverse();
    
    var sample_values = result.sample_values.reverse();
    var otu_labels = result.otu_labels.reverse();
    // 12. Create the trace for the bubble chart.
       var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          mode: 'markers',
          text: otu_labels,
          marker: {
            size: sample_values,
            color: otu_ids,
          },
        },
      ];

    // 13. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample' ,
      xaxis: { title: 'OTU ID' },
    };
    // 14. Use Plotly to plot bubble chart with the data and the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout)

  });
}

 // 15. Data for guage chart
 function buildGaugeChart(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata
    .filter(sampleObj => {
      return sampleObj.id == sample
    });
    console.log(resultArray);

    var result = resultArray[0];
    console.log(result);
    var wash_freq = result.wfreq;
    

// 16. Create the trace for the gauge chart.
var gaugeData = [
 {
   domain: { x: [0, 1], y: [0, 1] },
   value: wash_freq,
   title: {text: "Belly Button Washing Frequency <br> Scrubs per Week", font: {size: 18}},
   type: "indicator",
   mode: "gauge+number",
   gauge: {
     axis: { range: [null, 10]},
     bar: { color: "black" },
     steps: [
       { range: [0, 2], color: 'red' },
       { range: [2, 4], color: 'orange' },
       { range: [4, 6], color: 'yellow' },
       { range: [6, 8], color: 'seagreen' },
       { range: [8, 10], color:'green' }

     ],
   }  
 } 
];

// 17. Create the layout for the gauge chart.
var gaugeLayout = { 
  width: 600, 
  height: 500, 
  margin: { t: 0, b: 0 }
};
// 18. Use Plotly to plot the gauge data and layout.
 Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
