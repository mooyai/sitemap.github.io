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
  
  function displayColorRatios(colorRatios) {
    const colorResultsDiv = document.getElementById('colorResults');
    colorResultsDiv.innerHTML = ''; // Clear previous results
  
    for (let color in colorRatios) {
      let colorDiv = document.createElement('div');
      colorDiv.style.backgroundColor = color;
      colorDiv.textContent = `${color}: ${colorRatios[color]}%`;
      colorResultsDiv.appendChild(colorDiv);
    }
  }
  
  