import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function main() {
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
        'maxwell_the_cat_dingus.glb', // Path to your .glb file
        function (gltf) {
            model = gltf.scene;
            model.position.set(0, 0, 0); // Initial position
            scene.add(model);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded'); // Loading progress
        },
        function (error) {
            console.error('An error occurred while loading the GLB file:', error);
        }
    );

    // Position the camera
    camera.position.z = 55;

    // Event listener to track mouse movement
    document.addEventListener('mousemove', (event) => {
        // Normalize mouse position to -1 to 1 range
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Move the cat model to follow the mouse
        if (model) {
            model.position.x = mouse.x * 5 * 30; // Scale to fit the scene
            model.position.y = mouse.y * 5 * 30; // Scale to fit the scene

            model.rotation.y += 0.18; // Rotate on the Y-axis
        }

        renderer.render(scene, camera);
    }
    animate();
}

main();
