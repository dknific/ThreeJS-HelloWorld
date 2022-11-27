const cubeOrange = '#ff8f4a';
const coneBlue = '#91bbff';

const scene = new THREE.Scene();

// Docs: Camera(fieldOfView, aspectRatio, nearPlane, farPlane)
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
camera.position.z = 6;
camera.position.y = 1.5;
camera.rotation.x = -0.25;

// Create a Renderer with Antialising:
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(300, 300);
renderer.setClearColor("#f2f2f2");
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Docs: THREE.DirectionalLight(color, intensity)
const light = new THREE.SpotLight('white', 1);
light.position.set(-3.2, 4.1, 1.1);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 100;
light.target.position.set(-0.25, 0, 0);
scene.add(light, light.target);

// Docs: THREE.PointLight(color, intensity)
const pointLight = new THREE.PointLight('white', 0.6);
pointLight.position.set(-1.5, 4, -4);
scene.add(pointLight);

// Docs: THREE.BoxGeometry(width, height, depth);
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: cubeOrange });
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh.position.z = -1;
cubeMesh.position.x = -2;
cubeMesh.castShadow = true;
scene.add(cubeMesh);

// Docs: THREE.ConeGeometry(baseRadius, height, radialSegments):
const coneGeometry = new THREE.ConeGeometry(1, 2, 7);
const coneMaterial = new THREE.MeshLambertMaterial({ color: coneBlue });
const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
coneMesh.position.z = -1;
coneMesh.position.x = 2;
coneMesh.castShadow = true;
coneMesh.receiveShadow = true;
scene.add(coneMesh);

// Docs: THREE.PlaneGeometry(width, height):
const planeGeometry = new THREE.PlaneGeometry(20, 7);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide });
const ground = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ color: 'white' }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// Use a Raycaster to calculate what objects the mouse is over:
const raycaster = new THREE.Raycaster();

// Create a 2d Vector that will hold the cursor's x and y:
const mouse = new THREE.Vector2();
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

        // If the mouse is over ONLY the plane, do nothing but reset:
        if (intersects.length === 1 && intersects[0].object.geometry.type === 'PlaneGeometry') {
            cubeMesh.material.color.set(cubeOrange);
            coneMesh.material.color.set(coneBlue);
        } else {
            if (geometryType === 'ConeGeometry') {
                coneMesh.material.color.set('red');
            } else if (geometryType === 'BoxGeometry') {
                cubeMesh.material.color.set('#96ffb9');
            }
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

render();
