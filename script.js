import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

function main() {
    const audio = document.getElementById('myAudio');
    let textMesh; // To store the text mesh
    let prevMousePos = { x: 0, y: 0 }; // To store the previous mouse position
    let lastTime = performance.now(); // To track time for speed calculation
    let loadedFont;
    let rotationSpeed = 0;
    let pageClicked = false;

    function enableAudio() {
        audio.muted = false;
        audio.play().catch((error) => {
            console.error('Error playing audio:', error);
        });

        document.removeEventListener('click', enableAudio);
        pageClicked = true;

        // Change the text on click
        if (textMesh) {
            // Recreate the TextGeometry with the updated text
            const newGeometry = new TextGeometry('oiiaoiia', {
                font: loadedFont, // Use the globally loaded font
                size: 5, // Match the previous size
                depth: 1, // Use 'depth' instead of 'height'
                curveSegments: 12, // Match the previous curve segments
            });

            newGeometry.center(); // Center the text geometry

            // Dispose of the old geometry
            textMesh.geometry.dispose();
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

            // Assign the new geometry to the text mesh
            textMesh.geometry = newGeometry;
            textMesh.textMaterial = textMaterial;
            textMesh.position.set(0, 15, 10); // Adjusted for better visibility
            textMesh.rotation.set(0, 0, 0);

            // const boundingBox = textMesh.geometry.boundingBox;
            // const offsetX = (boundingBox.max.x - boundingBox.min.x) / 2;
            // const offsetY = (boundingBox.max.y - boundingBox.min.y) / 2;
            // textMesh.position.set(-offsetX, -offsetY, 0);
        }
    }

    document.addEventListener('click', enableAudio);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00ba00); // Green background

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Light
    const light = new THREE.AmbientLight(0xffffff, 1); // Soft white light
    scene.add(light);

    // Variables
    const mouse = new THREE.Vector2(); // To store mouse position
    let model; // To store the loaded model

    // GLTFLoader to load the cat model
    const loader = new GLTFLoader();
    loader.load(
        'maxwell_the_cat_dingus.glb',
        (gltf) => {
            model = gltf.scene;
            model.position.set(0, 0, 0); // Initial position
            scene.add(model);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error('An error occurred while loading the GLB file:', error);
        }
    );

    // Add text saying "CLICK ME"
    const fontLoader = new FontLoader();
    fontLoader.load(
        'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        (font) => {
            loadedFont = font;
            const textGeometry = new TextGeometry('CLICK', {
                font: font,
                size: 5,
                height: 1,
                curveSegments: 12,
            });

            textGeometry.center(); // Center the text geometry

            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            textMesh = new THREE.Mesh(textGeometry, textMaterial);

            // Center the text geometry
            // textGeometry.computeBoundingBox();
            // const boundingBox = textGeometry.boundingBox;
            // const offsetX = (boundingBox.max.x - boundingBox.min.x) / 2;
            // const offsetY = (boundingBox.max.y - boundingBox.min.y) / 2;
            // textMesh.position.set(-offsetX, -offsetY, 0); // Center the text within the group

            textMesh.position.set(0, 15, 10); // Adjusted for better visibility
            textMesh.rotation.set(0, 0, 0)
            scene.add(textMesh);
        },
        undefined,
        (error) => {
            console.error('Error loading font:', error);
        }
    );

    // Position the camera
    camera.position.z = 55; // Adjusted for better framing

    // Event listener to track mouse movement
    document.addEventListener('mousemove', (event) => {
        const currentTime = performance.now();
        const elapsedTime = currentTime - lastTime;

        // Calculate mouse speed
        const deltaX = event.clientX - prevMousePos.x;
        const deltaY = event.clientY - prevMousePos.y;
        const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / elapsedTime;

        prevMousePos = { x: event.clientX, y: event.clientY };
        lastTime = currentTime;

        // Change background color if speed exceeds threshold
        if (speed > 6.5) { // Adjust threshold as needed
            scene.background = new THREE.Color(Math.random(), Math.random(), Math.random());
        }

        // Normalize mouse position to -1 to 1 range
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        rotationSpeed = speed * 0.1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Move the cat model to follow the mouse
        if (model) {
            model.position.x = Math.max(-50, Math.min(50, mouse.x * 5 * 30));
            model.position.y = Math.max(-50, Math.min(50, mouse.y * 5 * 30));

            model.rotation.y += 0.25; // Rotate on the Y-axis
        }

        // Rotate the text based on the calculated speed
        if (pageClicked && textMesh) {
            textMesh.rotation.y += rotationSpeed;
        }

        renderer.render(scene, camera);
    }
    animate();
}

main();
