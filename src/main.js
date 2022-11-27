// STEP 1: CONFIGURATION:
// ----------------------
let scene;
let camera;
let renderer;

// Create a new, empty Scene:
scene = new THREE.Scene();

// Camera(fieldOfView, aspectRatio, nearPlane, farPlane)
camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
camera.position.z = 6;
camera.position.y = 1.5;
camera.rotation.x = -0.25;

// Create a Renderer with antialising:
renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure the Renderer's size, clear color, etc:
renderer.setSize(300, 300);
renderer.setClearColor("#f2f2f2");

// Append Renderer to DOM:
document.body.appendChild(renderer.domElement);






// STEP 2: CREATE and ADD a MESH:
// ----------------------
// Define a Geometry set for the Mesh first:
let geometry;
let material;
let cubeMesh;
let cubeOrange = '#ff8f4a';

// BoxGeometry(width, height, depth);
geometry = new THREE.BoxGeometry(2, 2, 2);

// Define the Material the Mesh will have:
material = new THREE.MeshLambertMaterial({ color: cubeOrange });

// Create a new Mesh using your GeometryObj and Material:
cubeMesh = new THREE.Mesh(geometry, material);
cubeMesh.position.z = -1;
cubeMesh.position.x = -2;

// Add the Mesh to the Scene:
scene.add(cubeMesh);

// OPTIONAL: Create, position, and add a point Light:
const light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(10,0,25);
scene.add(light);

// Create and add a Cone Mesh:
let coneGeometry;
let coneMaterial;
let coneMesh;
let coneBlue = '#91bbff';

coneGeometry = new THREE.ConeGeometry(1, 2, 7);
coneMaterial = new THREE.MeshLambertMaterial({ color: coneBlue });
coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);

coneMesh.position.z = -1;
coneMesh.position.x = 2;
scene.add(coneMesh);



// STEP 2.1: Tracking the user's mouse with a Raycaster:
// ----------------------
let raycaster;
let mouse;

// Use a Raycaster to calculate what objects the mouse is over:
raycaster = new THREE.Raycaster();

// Create a 2d Vector that will hold the cursor's x and y:
mouse = new THREE.Vector2();

// Three.js starts with the cursor defaulted at (0,0,0), so let's move it:
mouse.x = -1;
mouse.y = -1;

// Define our mouse updating function which will be an event listener on the canvas:
function updateMouseCoordinates(event) {
    event.preventDefault();

    // We want the cursor position with respect to the canvas, not the window.
    // Use renderer.domeElement to access the canvas:
    const boundingBox = renderer.domElement.getBoundingClientRect();
    const x = event.clientX - boundingBox.left;
    const y = event.clientY - boundingBox.top;

    mouse.x = ( x / (boundingBox.right - boundingBox.left) ) * 2 - 1;
    mouse.y = - ( y / (boundingBox.bottom - boundingBox.top) ) * 2 + 1;
}

// Append the function to the Renderer's <canvas> element as a listener:
renderer.domElement.addEventListener('pointermove', (event) => updateMouseCoordinates(event));







// STEP 3: Create the Render Loop.
// This function will be called on every single frame:
// ----------------------
const render = function() {
    // requestAnimationFrame() is basically an advanced setInterval() in Three.js:
    requestAnimationFrame(render);

    // Retrieve and update current mouse position on each frame:
    raycaster.setFromCamera(mouse, camera);

    // Get an array of objects that the mouse intersects with:
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const geometryType = intersects[0].object.geometry.type;
        if (geometryType === 'ConeGeometry') {
            coneMesh.material.color.set('#474a48');
        } else if (geometryType === 'BoxGeometry') {
            cubeMesh.material.color.set('#96ffb9');
        }
    } else {
        cubeMesh.material.color.set(cubeOrange);
        coneMesh.material.color.set(coneBlue);
    }

    // Make cube rotate:
    cubeMesh.rotation.y += 0.01;
    coneMesh.rotation.y -= 0.01;

    // Render the scene:
    renderer.render(scene, camera);
}







//STEP 4: Call Render Loop!
// ----------------------
render();
