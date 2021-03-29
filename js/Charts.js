function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");


  // python -m http.server
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
    var data_sample = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = data_sample.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
  
		var otuIds_10 = otu_ids.slice(0, 10).reverse();
		var otuLabels_10 = otu_labels.slice(0, 10).reverse();
    var sampleValues_10 = sample_values.slice(0, 10).reverse();


    /////////////////////////////////////////////////////////////////////////////////////////bar chart
    var trace1 = {
      x: sampleValues_10,
			y: otuIds_10.map(outId => `OTU ${outId}`),
			text: otuLabels_10,
			type: "bar",
			orientation: "h"
    };

    // 8. Create the trace for the bar chart. 
    var data1 = [trace1];

    // 9. Create the layout for the bar chart. 
    var Layout1 = {
      title: `<b>Top 10 OTUs found in selected Test Subject ID No<b>`,
		  xaxis: { title: "Sample Value"},
		  yaxis: { title: "OTU ID"},
		  autosize: false
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",data1,Layout1);
   
    /////////////////////////////////////////////////////////////////////////////////////////Bubble Chart
    
    var trace2 = {
      x: sampleValues_10,
			y: otuIds_10.map(outId => `OTU ${outId}`),
			text: otuLabels_10,
			mode: 'markers',
			marker: {
				color: otuIds_10,
				size:  sampleValues_10
			}
		};
    
    // 8. Create the trace for the bar chart. 
    var data2= [trace2];

    // 9. Create the layout for the bar chart. 
    var layout2= {
			title: '<b>Bubble Chart displaying sample values of OTU IDs of the selected individual<b>',
			xaxis: { title: "OTU ID"},
			yaxis: { title: "Sample Value"},
			showlegend: false,
		};


    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot( "bubble",data2,layout2);
   
    /////////////////////////////////////////////////////////////////////////////////////////Bubble Chart
    
    var Selwfreq = data.metadata.filter(sampleObj => sampleObj.id == sample)[0];

    
    var gaugeData = [
			{
				domain: { x: [0, 1], y: [0, 1] },
				value: Selwfreq.wfreq,
				title: {text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week'},
				type: "indicator",
				mode: "gauge+number",
				gauge: {
					axis: { range: [null, 9] },
					steps: [
						{ range: [0, 1], color: 'rgb(253, 249, 249)' },
						{ range: [1, 2], color: 'rgb(255, 240, 236)' },
						{ range: [2, 3], color: 'rgb(255, 233, 216)' },
						{ range: [3, 4], color: 'rgb(255, 227, 192)' },
						{ range: [4, 5], color: 'rgb(255, 225, 164)' },
						{ range: [5, 6], color: 'rgb(255, 226, 133)' },
						{ range: [6, 7], color: 'rgb(255, 229, 102)' },
						{ range: [7, 8], color: 'rgb(255, 236, 70)' },
						{ range: [8, 9], color: 'rgb(231, 243, 34)' },
					],
				}
			}
		];

		var layout3 = { width: 600, height: 450, margin: { t: 0, b: 0 } };

		Plotly.newPlot('gauge', gaugeData, layout3);

  });
}


