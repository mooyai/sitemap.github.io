document.getElementById('imageUploader').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.getElementById('colorCanvas');
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Implement the color analysis logic here
      };
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
  });
  
  function analyzeColors(canvas) {
    // Get the pixel data from the canvas
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const colors = {}; // Object to hold color counts
    
    // Loop over each pixel and increment the count of the color
    for (let i = 0; i < imageData.data.length; i += 4) {
      const color = `${imageData.data[i]},${imageData.data[i+1]},${imageData.data[i+2]}`;
      colors[color] = (colors[color] || 0) + 1;
    }
    
    // Convert counts to percentages
    const totalPixels = canvas.width * canvas.height;
    const colorProportions = Object.keys(colors).map(color => ({
      color: `rgb(${color})`,
      proportion: (colors[color] / totalPixels) * 100
    }));
    
    // Sort colors by proportion
    colorProportions.sort((a, b) => b.proportion - a.proportion);
    
    return colorProportions;
  }

  function getColorData(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let colorCounts = {};
  
    for (let i = 0; i < imageData.length; i += 4) {
      // Convert each pixel's color into a string format
      let color = `rgb(${imageData[i]}, ${imageData[i+1]}, ${imageData[i+2]})`;
  
      // Count each color's occurrence
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    }
  
    return colorCounts;
  }
  
  function calculateColorRatios(colorCounts, totalPixels) {
    let colorRatios = {};
  
    for (let color in colorCounts) {
      let ratio = (colorCounts[color] / totalPixels) * 100;
      colorRatios[color] = ratio.toFixed(2); // Keeping two decimal points
    }
  
    return colorRatios;
  }
  
  document.getElementById('imageUploader').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.getElementById('colorCanvas');
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Analyze the colors
        let colorCounts = getColorData(canvas);
        let colorRatios = calculateColorRatios(colorCounts, canvas.width * canvas.height);
  
        // Display the results
        displayColorRatios(colorRatios);
      };
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
  });
  

//   function displayColorRatios(colorRatios) {
//     const colorResultsDiv = document.getElementById('colorResults');
//     colorResultsDiv.innerHTML = '';

//     // Convert object to an array and sort by percentage
//     const sortedColorRatios = Object.entries(colorRatios).sort((a, b) => b[1] - a[1]);

//     // Iterate over the sorted array to create and append divs
//     sortedColorRatios.forEach(([color, ratio]) => {
//         let [r, g, b] = color.split(',');
//         let colorDiv = document.createElement('div');
//         colorDiv.style.backgroundColor = color;
//         colorDiv.style.height = `${colorRatios[color]}%`;
//         colorDiv.textContent = `${ratio}%`;
//         colorResultsDiv.appendChild(colorDiv);
//     });
// }


function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
      const hex = parseInt(x, 10).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function displayColorRatios(colorRatios) {
  const colorResultsDiv = document.getElementById('colorResults');
  colorResultsDiv.innerHTML = '';

  // Convert object to an array and sort by percentage
  const sortedColorRatios = Object.entries(colorRatios).sort((a, b) => b[1] - a[1]);

  sortedColorRatios.forEach(([color, ratio]) => {
      // Extract RGB values and convert them to integers
      let [r, g, b] = color.match(/\d+/g).map(Number);

      // Convert RGB to HEX
      let hexColor = rgbToHex(r, g, b);

      // Create and append divs
      let colorDiv = document.createElement('div');
      colorDiv.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      colorDiv.style.height = `${ratio}%`;
      colorDiv.textContent = `${hexColor} - ${ratio}%`;
      colorResultsDiv.appendChild(colorDiv);
  });
}
