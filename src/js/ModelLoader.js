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

        // Enable shadows and fix materials - replace with new materials
        fbx.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                // Replace materials entirely with new MeshStandardMaterial
                const oldMaterial = child.material;

                if (oldMaterial) {
                    // Check if we should preserve textures
                    let textureMap = null;
                    let normalMap = null;
                    let originalColor = null;

                    const materials = Array.isArray(oldMaterial) ? oldMaterial : [oldMaterial];

                    // Try to extract texture and color from original materials
                    materials.forEach(mat => {
                        if (mat && mat.map) {
                            textureMap = mat.map;
                        }
                        if (mat && mat.normalMap) {
                            normalMap = mat.normalMap;
                        }
                        if (mat && mat.color && (mat.color.r > 0 || mat.color.g > 0 || mat.color.b > 0)) {
                            originalColor = mat.color.clone();
                        }
                    });

                    // Create new material with proper defaults
                    const newMaterial = new THREE.MeshStandardMaterial({
                        color: originalColor || 0x888888, // Default to gray if no color found
                        map: textureMap || null,
                        normalMap: normalMap || null,
                        metalness: 0.3,
                        roughness: 0.7,
                        side: THREE.DoubleSide
                    });

                    // Replace material
                    child.material = newMaterial;

                    // Dispose old materials to free memory
                    materials.forEach(mat => {
                        if (mat) {
                            if (mat.map) mat.map.dispose();
                            if (mat.normalMap) mat.normalMap.dispose();
                            mat.dispose();
                        }
                    });
                } else {
                    // No material exists, create a default one
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x888888,
                        metalness: 0.3,
                        roughness: 0.7,
                        side: THREE.DoubleSide
                    });
                }
            }
        });

        // Add to scene
        this.scene.add(fbx);
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
                            child.material.forEach(mat => mat.dispose());
                        } else {
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
