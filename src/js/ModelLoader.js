import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'three';

export class ModelLoader {
    constructor(scene, onProgress, onComplete, onError) {
        this.scene = scene;
        this.loader = new FBXLoader();
        this.model = null;
        this.onProgress = onProgress;
        this.onComplete = onComplete;
        this.onError = onError;
    }

    loadModel(modelPath) {
        return new Promise((resolve, reject) => {
            this.loader.load(
                modelPath,
                (fbx) => {
                    this.model = fbx;
                    this.processModel(fbx);
                    if (this.onComplete) this.onComplete(fbx);
                    resolve(fbx);
                },
                (progress) => {
                    const percentage = (progress.loaded / progress.total) * 100;
                    if (this.onProgress) {
                        this.onProgress(percentage);
                    }
                },
                (error) => {
                    console.error('Error loading FBX model:', error);
                    if (this.onError) this.onError(error);
                    reject(error);
                }
            );
        });
    }

    processModel(fbx) {
        // Scale and position the model
        const box = new THREE.Box3().setFromObject(fbx);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Calculate scale to fit model in view
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        fbx.scale.multiplyScalar(scale);

        // Center the model
        fbx.position.x = -center.x * scale;
        fbx.position.y = -center.y * scale;
        fbx.position.z = -center.z * scale;

        // Process materials - preserve original colors from FBX
        fbx.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                // Get the original material(s)
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                const newMaterials = [];

                materials.forEach(mat => {
                    if (mat) {
                        // Create new material preserving original properties
                        const newMaterial = new THREE.MeshStandardMaterial({
                            color: mat.color ? mat.color.clone() : new THREE.Color(0xcccccc),
                            map: mat.map || null,
                            normalMap: mat.normalMap || null,
                            roughnessMap: mat.roughnessMap || null,
                            metalnessMap: mat.metalnessMap || null,
                            emissive: mat.emissive ? mat.emissive.clone() : new THREE.Color(0x000000),
                            emissiveMap: mat.emissiveMap || null,
                            emissiveIntensity: mat.emissiveIntensity || 0,
                            metalness: mat.metalness !== undefined ? mat.metalness : 0.3,
                            roughness: mat.roughness !== undefined ? mat.roughness : 0.7,
                            side: THREE.DoubleSide,
                            transparent: mat.transparent || false,
                            opacity: mat.opacity !== undefined ? mat.opacity : 1.0
                        });

                        // If the material has a name, preserve it
                        if (mat.name) {
                            newMaterial.name = mat.name;
                        }

                        newMaterials.push(newMaterial);
                    } else {
                        // Fallback material
                        newMaterials.push(new THREE.MeshStandardMaterial({
                            color: 0xcccccc,
                            metalness: 0.3,
                            roughness: 0.7,
                            side: THREE.DoubleSide
                        }));
                    }
                });

                // Assign the new material(s)
                child.material = newMaterials.length === 1 ? newMaterials[0] : newMaterials;

                // Force material update
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.needsUpdate = true);
                } else {
                    child.material.needsUpdate = true;
                }
            }
        });

        // Add to scene
        this.scene.add(fbx);
        
        console.log('Model loaded and processed successfully');
    }

    getModel() {
        return this.model;
    }

    removeModel() {
        if (this.model) {
            this.scene.remove(this.model);
            // Dispose of geometry and materials
            this.model.traverse((child) => {
                if (child.isMesh) {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                if (mat.map) mat.map.dispose();
                                if (mat.normalMap) mat.normalMap.dispose();
                                if (mat.roughnessMap) mat.roughnessMap.dispose();
                                if (mat.metalnessMap) mat.metalnessMap.dispose();
                                mat.dispose();
                            });
                        } else {
                            if (child.material.map) child.material.map.dispose();
                            if (child.material.normalMap) child.material.normalMap.dispose();
                            if (child.material.roughnessMap) child.material.roughnessMap.dispose();
                            if (child.material.metalnessMap) child.material.metalnessMap.dispose();
                            child.material.dispose();
                        }
                    }
                }
            });
            this.model = null;
        }
    }

    // Fallback: create a placeholder model if FBX fails to load
    createPlaceholderModel() {
        const group = new THREE.Group();

        // Create a basic geometric representation
        const geometry = new THREE.CylinderGeometry(2, 2, 4, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0x8b5cf6,
            metalness: 0.7,
            roughness: 0.3,
            emissive: 0x000000
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);

        this.model = group;
        this.scene.add(group);
        return group;
    }
}