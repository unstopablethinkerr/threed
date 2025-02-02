 // DOM Elements
const controlBtn = document.getElementById('control-btn');
const controlOptions = document.getElementById('control-options');
const sliders = document.getElementById('sliders');
const scalingSliders = document.getElementById('scaling-sliders');
const positionSliders = document.getElementById('position-sliders');
const tiltSliders = document.getElementById('tilt-sliders');
const resetBtn = document.getElementById('reset-btn');
const hiroCard = document.getElementById('hiro-card');

// Event Listeners
controlBtn.addEventListener('click', () => {
    controlOptions.classList.toggle('hidden');
    sliders.classList.add('hidden'); // Hide sliders when options are shown
});

controlOptions.addEventListener('click', (e) => {
    if (e.target.classList.contains('option-btn')) {
        const option = e.target.getAttribute('data-option');
        showSliders(option);
        controlOptions.classList.add('hidden');
    }
});

resetBtn.addEventListener('click', resetControls);

// Show Sliders Based on Option
function showSliders(option) {
    scalingSliders.classList.add('hidden');
    positionSliders.classList.add('hidden');
    tiltSliders.classList.add('hidden');

    if (option === 'scaling') {
        scalingSliders.classList.remove('hidden');
    } else if (option === 'position') {
        positionSliders.classList.remove('hidden');
    } else if (option === 'tilt') {
        tiltSliders.classList.remove('hidden');
    }

    sliders.classList.remove('hidden');
}

// Update Hiro Card Transformations
function updateTransform() {
    const scale = document.getElementById('scale').value;
    const xPosition = document.getElementById('x-position').value;
    const yPosition = document.getElementById('y-position').value;
    const tiltX = document.getElementById('tilt-x').value;
    const tiltY = document.getElementById('tilt-y').value;
    const tiltZ = document.getElementById('tilt-z').value;

    hiroCard.style.transform = `
        translate(-50%, -50%)
        scale(${scale})
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
        rotateZ(${tiltZ}deg)
    `;
    hiroCard.style.left = `${xPosition}%`;
    hiroCard.style.top = `${yPosition}%`;
}

document.getElementById('scale').addEventListener('input', updateTransform);
document.getElementById('x-position').addEventListener('input', updateTransform);
document.getElementById('y-position').addEventListener('input', updateTransform);
document.getElementById('tilt-x').addEventListener('input', updateTransform);
document.getElementById('tilt-y').addEventListener('input', updateTransform);
document.getElementById('tilt-z').addEventListener('input', updateTransform);

// Reset All Controls
function resetControls() {
    document.getElementById('scale').value = 1;
    document.getElementById('x-position').value = 50;
    document.getElementById('y-position').value = 50;
    document.getElementById('tilt-x').value = 0;
    document.getElementById('tilt-y').value = 0;
    document.getElementById('tilt-z').value = 0;

    updateTransform();
}

// Request access to the back camera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: "environment" } }
        });
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
}

// Start the camera when the page loads
startCamera();
