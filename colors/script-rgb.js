document.getElementById('imageUploader').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('colorCanvas');
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            let colorCounts = getColorData(canvas);
            let groupedColorCounts = groupSimilarColorsHSL(colorCounts);
            let colorRatios = calculateColorRatios(groupedColorCounts, canvas.width * canvas.height);

            displayColorRatios(colorRatios);
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
});

function getColorData(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let colorCounts = {};

    for (let i = 0; i < imageData.length; i += 4) {
        let color = `${imageData[i]}, ${imageData[i+1]}, ${imageData[i+2]}`;
        colorCounts[color] = (colorCounts[color] || 0) + 1;
    }

    return colorCounts;
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function groupSimilarColorsHSL(colorCounts, hueThreshold = 0.02) {
    let groupedColors = {};
    let processedColors = new Set();

    for (let color in colorCounts) {
        if (processedColors.has(color)) continue;

        let [r1, g1, b1] = color.split(',').map(Number);
        let [h1, s1, l1] = rgbToHsl(r1, g1, b1);
        let similarColorSum = colorCounts[color];
        let similarColorCount = 1;

        for (let compareColor in colorCounts) {
            if (color === compareColor || processedColors.has(compareColor)) continue;

            let [r2, g2, b2] = compareColor.split(',').map(Number);
            let [h2, s2, l2] = rgbToHsl(r2, g2, b2);
            
            // Grouping based on hue similarity
            let hueDistance = Math.min(Math.abs(h2 - h1), 1 - Math.abs(h2 - h1));
            if (hueDistance <= hueThreshold) {
                similarColorSum += colorCounts[compareColor];
                similarColorCount++;
                processedColors.add(compareColor);
            }
        }

        groupedColors[color] = similarColorSum; // Use original color for simplicity
    }

    return groupedColors;
}

function calculateColorRatios(groupedColorCounts, totalPixels) {
    let colorRatios = {};

    for (let color in groupedColorCounts) {
        let ratio = (groupedColorCounts[color] / totalPixels) * 100;
        colorRatios[color] = ratio.toFixed(2);
    }

    return colorRatios;
}

function displayColorRatios(colorRatios) {
    const colorResultsDiv = document.getElementById('colorResults');
    colorResultsDiv.innerHTML = '';

    // Convert object to an array and sort by percentage
    const sortedColorRatios = Object.entries(colorRatios).sort((a, b) => b[1] - a[1]);

    // Iterate over the sorted array to create and append divs
    sortedColorRatios.forEach(([color, ratio]) => {
        let [r, g, b] = color.split(',');
        let colorDiv = document.createElement('div');
        colorDiv.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        colorDiv.style.height = `${colorRatios[color]}%`;
        colorDiv.textContent = `${ratio}%`;
        colorResultsDiv.appendChild(colorDiv);
    });
}

// function displayColorRatios(colorRatios) {
//     const colorResultsDiv = document.getElementById('colorResults');
//     colorResultsDiv.innerHTML = '';

//     const sortedColorRatios = Object.entries(colorRatios).sort((a, b) => b[1] - a[1]);

//     sortedColorRatios.forEach(([color, ratio]) => {
//         let [r, g, b] = color.split(',');
//         let colorDiv = document.createElement('div');
//         colorDiv.classList.add('colorBlock');
//         colorDiv.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

//         // Adjust the size of the div based on the ratio
//         const size = Math.max(30, ratio * 2); // Example scaling, adjust as needed
//         colorDiv.style.width = `${size}px`;
//         colorDiv.style.height = `${size}px`;

//         colorDiv.textContent = `${ratio}%`;
//         colorResultsDiv.appendChild(colorDiv);
//     });
// }

// function displayColorRatios(colorRatios) {
//     const colorResultsDiv = document.getElementById('colorResults');
//     colorResultsDiv.innerHTML = '';

//     const sortedColorRatios = Object.entries(colorRatios).sort((a, b) => b[1] - a[1]);

//     sortedColorRatios.forEach(([color, ratio]) => {
//         let [r, g, b] = color.split(',');
//         let colorDiv = document.createElement('div');
//         colorDiv.classList.add('colorBlock');
//         colorDiv.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

//         // Adjust the height of the div based on the ratio
//         const height = Math.max(30, ratio * 3); // Adjust as needed
//         colorDiv.style.height = `${height}px`;

//         colorDiv.textContent = `${ratio}%`;
//         colorResultsDiv.appendChild(colorDiv);
//     });
// }
