// DOM Elements
const controlBtn = document.getElementById('control-btn');
const controlOptions = document.getElementById('control-options');
const sliders = document.getElementById('sliders');
const scalingSliders = document.getElementById('scaling-sliders');
const positionSliders = document.getElementById('position-sliders');
const tiltSliders = document.getElementById('tilt-sliders');
const resetBtn = document.getElementById('reset-btn');
const video = document.getElementById('video');
const fixBtn = document.getElementById('fix-btn');

let isFixed = false;
let fixedPosition = { x: 0, y: 0, z: 0 };
let fixedScale = 1;

// Event Listeners
controlBtn.addEventListener('click', () => {
    controlOptions.classList.toggle('hidden');
    sliders.classList.add('hidden');
});

controlOptions.addEventListener('click', (e) => {
    if (e.target.classList.contains('option-btn')) {
        const option = e.target.getAttribute('data-option');
        showSliders(option);
        controlOptions.classList.add('hidden');
    }
});

resetBtn.addEventListener('click', resetControls);
fixBtn.addEventListener('click', () => {
    isFixed = !isFixed;
    if (isFixed) {
        fixedPosition = {
            x: parseFloat(document.getElementById('x-position').value),
            y: parseFloat(document.getElementById('y-position').value),
            z: 0
        };
        fixedScale = parseFloat(document.getElementById('scale').value);
        fixBtn.textContent = 'Unpin';
        controlBtn.disabled = true;
        resetBtn.disabled = true;
        startDeviceMotionTracking();
    } else {
        fixBtn.textContent = 'Fix Position';
        controlBtn.disabled = false;
        resetBtn.disabled = false;
        stopDeviceMotionTracking();
    }
});

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

// Update Model Transformations
function updateTransform() {
    const scale = document.getElementById('scale').value;
    const xPosition = document.getElementById('x-position').value;
    const yPosition = document.getElementById('y-position').value;
    const tiltX = document.getElementById('tilt-x').value;
    const tiltY = document.getElementById('tilt-y').value;
    const tiltZ = document.getElementById('tilt-z').value;

    const model = document.querySelector('a-entity[gltf-model]');
    model.setAttribute('scale', `${scale} ${scale} ${scale}`);
    model.setAttribute('position', `${xPosition / 100 * 10 - 5} ${yPosition / 100 * 10 - 5} 0`);
    model.setAttribute('rotation', `${tiltX} ${tiltY} ${tiltZ}`);
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

// Track Device Movement
function startDeviceMotionTracking() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientationEvent, true);
    } else {
        alert('DeviceOrientation API is not supported in your browser.');
    }
}

function stopDeviceMotionTracking() {
    window.removeEventListener('deviceorientation', handleOrientationEvent, true);
}

function handleOrientationEvent(event) {
    if (isFixed) {
        const alpha = event.alpha; // Z-axis rotation (0-360 degrees)
        const beta = event.beta;  // X-axis rotation (-180-180 degrees)
        const gamma = event.gamma; // Y-axis rotation (-90-90 degrees)

        // Adjust the position and scale based on device orientation
        const newXPosition = fixedPosition.x + (gamma / 90) * 10;
        const newYPosition = fixedPosition.y + (beta / 90) * 10;
        const newScale = fixedScale + (alpha / 360) * 0.5;

        const model = document.querySelector('a-entity[gltf-model]');
        model.setAttribute('position', `${newXPosition / 100 * 10 - 5} ${newYPosition / 100 * 10 - 5} 0`);
        model.setAttribute('scale', `${newScale} ${newScale} ${newScale}`);
        model.setAttribute('rotation', `${beta} ${gamma} ${alpha}`);
    }
}
