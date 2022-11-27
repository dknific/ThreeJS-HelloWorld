const cubeOrange = '#ff8f4a';
const coneBlue = '#91bbff';

let scene;
let camera;
let renderer;

// Make a new, empty Scene:
scene = new THREE.Scene();

// Camera(fieldOfView, aspectRatio, nearPlane, farPlane)
camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
camera.position.z = 6;
camera.position.y = 1.5;
camera.rotation.x = -0.25;

// Create a Renderer with Antialising:
renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure the Renderer's size, clear color, etc:
renderer.setSize(300, 300);
renderer.setClearColor("#f2f2f2");

// Append Renderer to DOM.
// Refer to the <canvas> element the renderer is using, with renderer.domElement:
document.body.appendChild(renderer.domElement);

// Now that Three has been configured and appended,
// Create a Cube Mesh and Add it to the scene:
let cubeGeometry;
let cubeMaterial;
let cubeMesh;

// Using THREE.BoxGeometry(width, height, depth);
cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
cubeMaterial = new THREE.MeshLambertMaterial({ color: cubeOrange });

// Using THREE.Mesh(geometry, material):
cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh.position.z = -1;
cubeMesh.position.x = -2;

// Finally, add the Cube Mesh to the Scene:
scene.add(cubeMesh);

// Create a Cone Mesh and Add it:
let coneGeometry;
let coneMaterial;
let coneMesh;

// Using THREE.ConeGeometry(baseRadius, height, radialSegments):
coneGeometry = new THREE.ConeGeometry(1, 2, 7);
coneMaterial = new THREE.MeshLambertMaterial({ color: coneBlue });

coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
coneMesh.position.z = -1;
coneMesh.position.x = 2;

scene.add(coneMesh);

// Create a Point Light and position it:
// Using THREE.PointLight(color, intensity, spread)
const light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(10,0,25);
scene.add(light);

// Use Raycaster to track user's mouse movement:
let raycaster;
let mouse;

// Use a Raycaster to calculate what objects the mouse is over:
raycaster = new THREE.Raycaster();

// Create a 2d Vector that will hold the cursor's x and y:
mouse = new THREE.Vector2();

// Three.js starts with the cursor defaulted at (0,0,0), so let's move it:
mouse.x = -1;
mouse.y = -1;

// Define a Raycasting function that updates mouse position coords:
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

// Create the Render Loop. This function will be called on every single frame:
const render = function() {
    // requestAnimationFrame() is basically an advanced setInterval() in Three.js:
    requestAnimationFrame(render);

    // setFromCamera() takes in mouse coords, and the camera to update the ray.
    // setFromCamera(coordinates of mouse currently, camera):
    raycaster.setFromCamera(mouse, camera);

    // intersectObjects() returns an array of all objects in the casted ray:
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const geometryType = intersects[0].object.geometry.type;

        if (geometryType === 'ConeGeometry') {
            coneMesh.material.color.set('red');
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

// Finally, you have to actually call render():
render();
