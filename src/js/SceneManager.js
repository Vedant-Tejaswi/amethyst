import * as THREE from 'three';

export class SceneManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        this.init();
        this.setupResizeHandler();
    }

    init() {
        // Create scene with Yale blue background
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0D3B66);
        // Remove fog for cleaner look

        // Create camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(5, 5, 10);
        this.camera.lookAt(0, 0, 0);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        // Setup lighting
        this.setupLighting();

        // Add helpers (optional, for debugging)
        // const axesHelper = new THREE.AxesHelper(5);
        // this.scene.add(axesHelper);
    }

    setupLighting() {
        // Increased ambient light for better visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        // Main directional light - brighter and more prominent
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);

        // Additional lights for better illumination from different angles
        const light2 = new THREE.DirectionalLight(0xffffff, 0.8);
        light2.position.set(-10, 5, -5);
        this.scene.add(light2);

        // Top light
        const topLight = new THREE.DirectionalLight(0xffffff, 0.6);
        topLight.position.set(0, 10, 0);
        this.scene.add(topLight);

        // Point lights for fill lighting
        const pointLight1 = new THREE.PointLight(0x6366f1, 0.8, 50);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.6, 50);
        pointLight2.position.set(-5, 5, -5);
        this.scene.add(pointLight2);
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(width, height);
        });
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getRenderer() {
        return this.renderer;
    }

    setControls(controls) {
        this.controls = controls;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.controls) {
            this.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
    }
}
