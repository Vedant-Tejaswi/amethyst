import { SceneManager } from './js/SceneManager.js';
import { ModelLoader } from './js/ModelLoader.js';
import { CameraController } from './js/CameraController.js';
import { AnimationController } from './js/AnimationController.js';
import { UIManager } from './js/UIManager.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

class App {
    constructor() {
        this.sceneManager = null;
        this.modelLoader = null;
        this.cameraController = null;
        this.animationController = null;
        this.uiManager = null;
        this.controls = null;
        this.isModelLoaded = false;

        this.init();
    }

    async init() {
        // Initialize UI Manager
        this.uiManager = new UIManager();
        this.uiManager.setupHeroButtons();

        // Initialize Scene Manager
        this.sceneManager = new SceneManager('three-canvas');
        const scene = this.sceneManager.getScene();
        const camera = this.sceneManager.getCamera();
        const renderer = this.sceneManager.getRenderer();

        // Setup OrbitControls
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.enableRotate = true;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI;
        this.controls.autoRotate = false;
        this.sceneManager.setControls(this.controls);

        // Initialize Camera Controller
        this.cameraController = new CameraController(camera, this.controls);
        this.uiManager.setupViewControls(this.cameraController);

        // Initialize Animation Controller
        this.animationController = new AnimationController();

        // Setup scroll-based animations
        this.setupScrollAnimations();

        // Try to load FBX model
        await this.loadModel();

        // Start animation loop
        this.sceneManager.animate();

        // Setup scroll trigger after everything is loaded
        ScrollTrigger.refresh();
    }

    async loadModel() {
        const scene = this.sceneManager.getScene();

        this.modelLoader = new ModelLoader(
            scene,
            (percentage) => {
                // Update loading progress
                this.uiManager.updateLoadingProgress(percentage);
            },
            (model) => {
                // Model loaded successfully
                this.onModelLoaded(model);
            },
            (error) => {
                // Error loading model - create placeholder
                console.warn('Could not load FBX model, creating placeholder:', error);
                const placeholder = this.modelLoader.createPlaceholderModel();
                this.onModelLoaded(placeholder);
            }
        );

        // Try to load FBX model from public/models folder
        // User will need to add their FBX files here
        const modelPath = '/models/model.fbx';

        try {
            await this.modelLoader.loadModel(modelPath);
        } catch (error) {
            // If model path doesn't exist, create placeholder
            const placeholder = this.modelLoader.createPlaceholderModel();
            this.onModelLoaded(placeholder);
        }
    }

    onModelLoaded(model) {
        this.isModelLoaded = true;

        // Hide loading screen
        setTimeout(() => {
            this.uiManager.hideLoadingScreen();
            this.uiManager.showViewControls();
        }, 500);

        // Entrance animation
        this.animationController.entranceAnimation(model, {
            fadeIn: true,
            scaleIn: true,
            rotateIn: true,
            duration: 1.5,
            delay: 0.3
        });
    }

    setupScrollAnimations() {
        const camera = this.sceneManager.getCamera();
        const sections = document.querySelectorAll('.section');

        sections.forEach((section, index) => {
            if (index === 0) return; // Skip hero section

            gsap.from(section.querySelectorAll('.content-card, .spec-item, .tech-content'), {
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none none'
                }
            });

            // Different camera positions for different sections (optional)
            if (index === 2) { // Technology section
                gsap.to(camera.position, {
                    y: camera.position.y + 2,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top center',
                        end: 'bottom center',
                        scrub: true
                    }
                });
            }
        });

        // Hero section scroll animation
        gsap.to(camera.position, {
            z: camera.position.z + 5,
            scrollTrigger: {
                trigger: document.getElementById('home'),
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new App();
    });
} else {
    new App();
}

// Handle window resize for ScrollTrigger
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
