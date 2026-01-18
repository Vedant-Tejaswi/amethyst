import { gsap } from 'gsap';

export class CameraController {
    constructor(camera, controls = null) {
        this.camera = camera;
        this.controls = controls;
        this.isAnimating = false;
        
        // Default camera positions
        this.presets = {
            default: { position: [5, 5, 10], target: [0, 0, 0] },
            front: { position: [0, 0, 15], target: [0, 0, 0] },
            side: { position: [15, 0, 0], target: [0, 0, 0] },
            top: { position: [0, 15, 0], target: [0, 0, 0] },
            close: { position: [3, 3, 6], target: [0, 0, 0] }
        };
    }

    animateTo(position, target = [0, 0, 0], duration = 1.5) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // If controls exist, animate target too
        if (this.controls && this.controls.target) {
            gsap.to(this.controls.target, {
                x: target[0],
                y: target[1],
                z: target[2],
                duration: duration,
                ease: "power2.inOut"
            });
        }

        gsap.to(this.camera.position, {
            x: position[0],
            y: position[1],
            z: position[2],
            duration: duration,
            ease: "power2.inOut",
            onComplete: () => {
                this.isAnimating = false;
            }
        });
    }

    goToPreset(presetName, duration = 1.5) {
        const preset = this.presets[presetName];
        if (!preset) {
            console.warn(`Preset "${presetName}" not found`);
            return;
        }
        
        this.animateTo(preset.position, preset.target, duration);
    }

    resetView(duration = 1.5) {
        this.goToPreset('default', duration);
    }

    frontView(duration = 1.5) {
        this.goToPreset('front', duration);
    }

    sideView(duration = 1.5) {
        this.goToPreset('side', duration);
    }

    topView(duration = 1.5) {
        this.goToPreset('top', duration);
    }

    // Scroll-based camera animation
    createScrollAnimation(scrollTriggerConfig) {
        const { start, end, positionStart, positionEnd, targetStart = [0, 0, 0], targetEnd = [0, 0, 0] } = scrollTriggerConfig;

        if (this.controls && this.controls.target) {
            gsap.to(this.controls.target, {
                x: targetEnd[0],
                y: targetEnd[1],
                z: targetEnd[2],
                scrollTrigger: {
                    trigger: scrollTriggerConfig.trigger || document.body,
                    start: start || "top top",
                    end: end || "bottom top",
                    scrub: true
                }
            });
        }

        gsap.to(this.camera.position, {
            x: positionEnd[0],
            y: positionEnd[1],
            z: positionEnd[2],
            scrollTrigger: {
                trigger: scrollTriggerConfig.trigger || document.body,
                start: start || "top top",
                end: end || "bottom top",
                scrub: true
            }
        });
    }

    setControls(controls) {
        this.controls = controls;
    }
}
