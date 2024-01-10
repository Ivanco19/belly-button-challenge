// Declare global variables to store sample data
let samples;
let metadata;

// Read the JSON data
const dataPromise = d3.json('samples.json');

// Fetch the JSON data and console log it
dataPromise.then(function(data) {
  // Store in variables
  const names = data.names;
  metadata = data.metadata;
  samples = data.samples;

  // Plot with the first elements of the list
  buildBarChart(data.names[0]);
  buildBubbleChart(data.names[0]);

  // Get select element by its Id
  const selectElement = document.getElementById('selDataset');

  // Iterate through all list items and adds all of them to a select element
  names.forEach(function(name) {
    const option = document.createElement('option');
    option.value = name;
    option.text = name;
    selectElement.appendChild(option);
  });
});

// Function that builts a bar chart
function buildBarChart(selectedID) {
  // Get the info data for the selected Id
  let selectedSample = samples.find(sample => sample.id === selectedID);

  // Get the OTUs Top 10
  let top10OTUs = selectedSample.otu_ids.slice(0, 10).reverse();
  let top10Values = selectedSample.sample_values.slice(0, 10).reverse();
  let top10Labels = selectedSample.otu_labels.slice(0, 10).reverse();

  // Data object for plotly
  let barData = [{
    type: 'bar',
    x: top10Values,
    y: top10OTUs.map(otu => `OTU ${otu}`),
    text: top10Labels,
    orientation: 'h'
  }];

  // Layout labels
  let barLayout = {
    title: `Top 10 OTUs for Subject ID ${selectedID}`,
    xaxis: { title: 'Sample Values' },
    yaxis: { title: 'OTU ID' }
  };

  // Create the bar chart
  Plotly.newPlot('bar', barData, barLayout);

  // Update metadata panel info
  buildMetadataPanel(selectedID);
}

// Function that builts a bubble chart
function buildBubbleChart(selectedID) {
  // Get the info data for the selected Id
  let selectedSample = samples.find(sample => sample.id === selectedID);

  // Data object for plotly
  let bubbleData = [{
    type: 'scatter',
    mode: 'markers',
    x: selectedSample.otu_ids,
    y: selectedSample.sample_values,
    text: selectedSample.otu_labels,
    marker: {
      size: selectedSample.sample_values,
      color: selectedSample.otu_ids,
      colorscale: 'Earth'  
    }
  }];

  // Layout labels
  let bubbleLayout = {
    title: `Bacteria Cultures per Sample for Subject ID ${selectedID}`,
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Values' }
  };

  // Create the bubble chart
  Plotly.newPlot('bubble', bubbleData, bubbleLayout);

  // Update metadata panel info
  buildMetadataPanel(selectedID);
}



function buildMetadataPanel(selectedID) {
  // Filtrar los datos de metadatos para el ID seleccionado
  let selectedMetadata = metadata.find(entry => entry.id === parseInt(selectedID));

  // Seleccionar el elemento donde se mostrará la información
  const metadataPanel = document.getElementById('sample-metadata');

  // Limpiar el contenido anterior
  metadataPanel.innerHTML = '';

  // Iterar sobre las propiedades del objeto de metadatos y agregarlas al panel
  Object.entries(selectedMetadata).forEach(([key, value]) => {
    const metadataInfo = document.createElement('p');
    metadataInfo.innerHTML = `<strong>${key}:</strong> ${value}`;
    metadataPanel.appendChild(metadataInfo);
  });
}


// This function updates the charts and the medatata panel info when selecting a new item
function optionChanged(selectedID) {
  buildBarChart(selectedID);
  buildBubbleChart(selectedID);
  buildMetadataPanel(selectedID);
}
