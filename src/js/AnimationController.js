import { gsap } from 'gsap';
import * as THREE from 'three';

export class AnimationController {
    constructor() {
        this.animations = new Map();
    }

    // Fade in model
    fadeInModel(model, duration = 1.5) {
        if (!model) return;

        model.traverse((child) => {
            if (child.isMesh && child.material) {
                const material = Array.isArray(child.material) ? child.material[0] : child.material;
                
                // Set initial opacity
                if (!material.transparent) {
                    material.transparent = true;
                }
                
                if (material.opacity === undefined) {
                    material.opacity = 0;
                } else {
                    material.opacity = 0;
                }

                gsap.to(material, {
                    opacity: 1,
                    duration: duration,
                    ease: "power2.out"
                });
            }
        });
    }

    // Scale up entrance animation
    scaleInModel(model, duration = 1.5) {
        if (!model) return;

        model.scale.set(0, 0, 0);
        gsap.to(model.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: duration,
            ease: "back.out(1.7)"
        });
    }

    // Rotate entrance animation
    rotateInModel(model, duration = 1.5) {
        if (!model) return;

        model.rotation.y = -Math.PI * 2;
        gsap.to(model.rotation, {
            y: 0,
            duration: duration,
            ease: "power2.out"
        });
    }

    // Combined entrance animation
    entranceAnimation(model, options = {}) {
        const {
            fadeIn = true,
            scaleIn = true,
            rotateIn = true,
            duration = 1.5,
            delay = 0
        } = options;

        if (!model) return;

        if (fadeIn) {
            this.fadeInModel(model, duration);
        }

        if (scaleIn) {
            model.scale.set(0, 0, 0);
            gsap.to(model.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: duration,
                delay: delay,
                ease: "back.out(1.7)"
            });
        }

        if (rotateIn) {
            model.rotation.y = -Math.PI;
            gsap.to(model.rotation, {
                y: 0,
                duration: duration,
                delay: delay,
                ease: "power2.out"
            });
        }
    }

    // Hover animation
    createHoverAnimation(object, options = {}) {
        const {
            scale = 1.1,
            duration = 0.3,
            ease = "power2.out"
        } = options;

        const originalScale = object.scale.clone();
        
        object.userData.hoverAnimation = gsap.to(object.scale, {
            x: originalScale.x * scale,
            y: originalScale.y * scale,
            z: originalScale.z * scale,
            duration: duration,
            ease: ease,
            paused: true
        });
    }

    // Pulse animation
    pulseAnimation(object, options = {}) {
        const {
            scale = 1.1,
            duration = 1,
            repeat = -1,
            yoyo = true
        } = options;

        const originalScale = object.scale.clone();
        
        gsap.to(object.scale, {
            x: originalScale.x * scale,
            y: originalScale.y * scale,
            z: originalScale.z * scale,
            duration: duration,
            repeat: repeat,
            yoyo: yoyo,
            ease: "power2.inOut"
        });
    }

    // Rotate animation
    rotateAnimation(object, options = {}) {
        const {
            axis = 'y',
            angle = Math.PI * 2,
            duration = 5,
            repeat = -1,
            ease = "none"
        } = options;

        gsap.to(object.rotation, {
            [axis]: `+=${angle}`,
            duration: duration,
            repeat: repeat,
            ease: ease
        });
    }

    // Stop all animations on an object
    stopAnimations(object) {
        if (object.userData.hoverAnimation) {
            object.userData.hoverAnimation.kill();
        }
    }
}
