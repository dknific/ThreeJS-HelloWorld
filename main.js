// STEP 1: CONFIGURATION:
// ----------------------
// Create a new, empty Scene:
var scene = new THREE.Scene();

// Create and position a perspective Camera:
// Camera(fieldOfView, aspectRatio, nearPlane, farPlane)
var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2000);
camera.position.z = 5;

// Create a Renderer with antialising:
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure the Renderer's size, clear color, etc:
renderer.setSize(300, 300);
renderer.setClearColor("#f2f2f2");

// Append Renderer to DOM:
document.body.appendChild(renderer.domElement);

// STEP 2: CREATE and ADD a MESH:
// ----------------------
// Define a Geometry set for the Mesh first:
// BoxGeometry(width, height, depth);
var geometry = new THREE.BoxGeometry(2, 2, 2);

// Define the Material the Mesh will have:
var material = new THREE.MeshLambertMaterial({ color: 0xFFCC00 });

// Create a new Mesh using your GeometryObj and Material:
var cubeMesh = new THREE.Mesh(geometry, material);
cubeMesh.position.z = -1;

// Add the Mesh to the Scene:
scene.add(cubeMesh);

// OPTIONAL?: Create, position, and add a point Light:
var light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(10,0,25);
scene.add(light);

// STEP 3: Create the Render Loop:
// ----------------------
var render = function() {
    requestAnimationFrame(render);

    cubeMesh.rotation.y += 0.01;

    // Render the scene:
    renderer.render(scene, camera);
}

//STEP 4: Call Render Loop!
// ----------------------
render();