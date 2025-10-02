import * as fabric from 'fabric';
import { queue } from 'async';
import { Bubble } from './useFabricObjects';

const ANIMATION_CONFIG = {
    QUEUE_CONCURRENCY: 4,
    ARRANGEMENT_CONCURRENCY: 10,
    STAGGER_DELAY: 100,
    ARRANGEMENT_DURATION: 1000,
    ARRANGEMENT_EASING: fabric.util.ease.easeOutQuart,
};

export const useBubbleAnimation = (
    fabricCanvasRef: { current: fabric.Canvas | null },
    bubbles: Bubble[],
    setIsArranging: (value: boolean) => void,
    setIsPaused: (value: boolean) => void
) => {
    const animationRef = { current: 0 };
    const animationQueueRef = { current: null as any };
    const arrangementQueueRef = { current: null as any };

    // Animation loop chính
    const startAnimation = () => {
        if (!fabricCanvasRef.current || bubbles.length === 0) return;

        const animate = () => {
            if (!fabricCanvasRef.current) return;

            // Update shimmer effect
            bubbles.forEach((bubble, index) => {
                if (bubble.fabricObject && !bubble.isLocked) {
                    bubble.shimmer = (bubble.shimmer + 0.5) % 100;
                    const shimmerElement = bubble.fabricObject.getObjects().find(obj =>
                        obj instanceof fabric.Circle && (obj as any).fill instanceof fabric.Gradient
                    );
                    if (shimmerElement) {
                        const gradient = (shimmerElement as fabric.Circle).fill as any;
                        if (gradient && gradient.colorStops) {
                            const angle = (bubble.shimmer / 100) * 360;
                            gradient.coords = {
                                ...gradient.coords,
                                x1: Math.cos((angle - 90) * Math.PI / 180) * 60,
                                y1: Math.sin((angle - 90) * Math.PI / 180) * 60,
                            };
                        }
                    }
                }
            });

            // Physics và collision detection
            for (let i = 0; i < bubbles.length; i++) {
                if (bubbles[i].isLocked) continue;

                const bubble1 = bubbles[i];
                const obj1 = bubble1.fabricObject;

                // Wall collision
                const rect1 = obj1.getBoundingRect();
                const epsilon = 5;

                if (rect1.left < epsilon) {
                    obj1.set({ left: epsilon + rect1.width / 2 });
                    bubble1.speedX = Math.abs(bubble1.speedX) * 0.8;
                } else if (rect1.left + rect1.width > (fabricCanvasRef.current.width || 800) - epsilon) {
                    obj1.set({ left: (fabricCanvasRef.current.width || 800) - epsilon - rect1.width / 2 });
                    bubble1.speedX = -Math.abs(bubble1.speedX) * 0.8;
                }

                if (rect1.top < epsilon) {
                    obj1.set({ top: epsilon + rect1.height / 2 });
                    bubble1.speedY = Math.abs(bubble1.speedY) * 0.8;
                } else if (rect1.top + rect1.height > (fabricCanvasRef.current.height || 600) - epsilon) {
                    obj1.set({ top: (fabricCanvasRef.current.height || 600) - epsilon - rect1.height / 2 });
                    bubble1.speedY = -Math.abs(bubble1.speedY) * 0.8;
                }

                // Bubble collision
                for (let j = i + 1; j < bubbles.length; j++) {
                    if (bubbles[j].isLocked) continue;

                    const bubble2 = bubbles[j];
                    const obj2 = bubble2.fabricObject;

                    const rect2 = obj2.getBoundingRect();
                    const center1 = { x: rect1.left + rect1.width / 2, y: rect1.top + rect1.height / 2 };
                    const center2 = { x: rect2.left + rect2.width / 2, y: rect2.top + rect2.height / 2 };

                    const distanceSquared = Math.pow(center2.x - center1.x, 2) + Math.pow(center2.y - center1.y, 2);
                    const minDistance = 60; // Fixed radius

                    if (distanceSquared < minDistance * minDistance) {
                        // Collision detected
                        const distance = Math.sqrt(distanceSquared);
                        if (distance === 0) continue;

                        const angle = Math.atan2(center2.y - center1.y, center2.x - center1.x);
                        const overlap = minDistance - distance;

                        // Push bubbles apart
                        const pushX = Math.cos(angle) * overlap * 0.5;
                        const pushY = Math.sin(angle) * overlap * 0.5;

                        obj1.set({ left: obj1.left! - pushX, top: obj1.top! - pushY });
                        obj2.set({ left: obj2.left! + pushX, top: obj2.top! + pushY });

                        // Bounce effect
                        const restitution = 0.8;
                        const relativeVelocityX = bubble2.speedX - bubble1.speedX;
                        const relativeVelocityY = bubble2.speedY - bubble1.speedY;

                        const normalX = (center2.x - center1.x) / distance;
                        const normalY = (center2.y - center1.y) / distance;

                        const relativeVelocityDotNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;

                        if (relativeVelocityDotNormal < 0) {
                            const impulse = -relativeVelocityDotNormal * restitution;
                            bubble1.speedX -= impulse * normalX;
                            bubble1.speedY -= impulse * normalY;
                            bubble2.speedX += impulse * normalX;
                            bubble2.speedY += impulse * normalY;
                        }
                    }
                }

                // Update position
                if (!bubble1.isLocked) {
                    obj1.set({
                        left: obj1.left! + bubble1.speedX,
                        top: obj1.top! + bubble1.speedY,
                        // angle: obj1.angle! + bubble1.rotationSpeed, // Disabled rotation
                    });
                    obj1.setCoords();
                }
            }

            fabricCanvasRef.current.requestRenderAll();
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();
    };

    // Sắp xếp bubbles theo alphabet
    const arrangeBubblesAlphabetically = () => {
        if (!fabricCanvasRef.current || bubbles.length === 0) return;

        // Kill existing queue if any
        if (arrangementQueueRef.current) {
            arrangementQueueRef.current.kill();
            arrangementQueueRef.current = null;
        }

        setIsArranging(true);
        setIsPaused(true);

        // Sort bubbles alphabetically
        const sortedBubbles = [...bubbles].sort((a, b) => a.userName.localeCompare(b.userName));

        // Calculate grid positions
        const cols = Math.ceil(Math.sqrt(bubbles.length));
        const rows = Math.ceil(bubbles.length / cols);
        const spacing = 140;
        const startX = 100;
        const startY = 100;

        // Create arrangement queue
        arrangementQueueRef.current = queue(async (bubble: Bubble, callback) => {
            const index = sortedBubbles.indexOf(bubble);
            const col = index % cols;
            const row = Math.floor(index / cols);

            const targetX = startX + col * spacing;
            const targetY = startY + row * spacing;

            // Reset flags
            bubble.isMarkedDone = false;

            // Animate to position
            bubble.fabricObject.animate({
                left: targetX,
                top: targetY,
                // angle: 0, // Disabled rotation
            }, {
                duration: ANIMATION_CONFIG.ARRANGEMENT_DURATION,
                easing: ANIMATION_CONFIG.ARRANGEMENT_EASING,
                onChange: (value: any) => {
                    if (!bubble.isMarkedDone) {
                        const elapsedTime = Date.now() - (bubble.fabricObject as any)._animateStartTime;
                        const progressPercent = elapsedTime / ANIMATION_CONFIG.ARRANGEMENT_DURATION;

                        if (progressPercent >= 0.5) {
                            bubble.isMarkedDone = true;
                            callback();
                        }
                    }
                },
                onComplete: () => {
                    if (!bubble.isMarkedDone) {
                        bubble.isMarkedDone = true;
                        callback();
                    }
                }
            });

            // Set speed to 0 after animation
            bubble.speedX = 0;
            bubble.speedY = 0;
            // bubble.rotationSpeed = 0; // Disabled rotation
            bubble.isLocked = true;
        }, ANIMATION_CONFIG.ARRANGEMENT_CONCURRENCY);

        // Add error handling
        arrangementQueueRef.current.error((err: any, task: any) => {
            console.error('Arrangement queue error:', err);
        });

        // Add all bubbles to queue
        sortedBubbles.forEach(bubble => {
            arrangementQueueRef.current?.push(bubble);
        });

        // Check when all animations are done
        arrangementQueueRef.current.drain(() => {
            setIsArranging(false);
        });
    };

    // Toggle arrangement (pause/resume)
    const toggleArrangement = () => {
        // Get current state from the setter functions
        let currentIsArranging = false;
        let currentIsPaused = false;

        if (currentIsArranging) return;

        if (currentIsPaused) {
            // Resume animation
            setIsPaused(false);
            setIsArranging(false);

            // Kill arrangement queue
            if (arrangementQueueRef.current) {
                arrangementQueueRef.current.kill();
                arrangementQueueRef.current = null;
            }

            // Unlock all bubbles and randomize speeds
            bubbles.forEach(bubble => {
                bubble.isLocked = false;
                bubble.isArranging = false;
                bubble.isMarkedDone = false;
                bubble.speedX = (Math.random() - 0.5) * 0.8;
                bubble.speedY = (Math.random() - 0.5) * 0.8;
                // bubble.rotationSpeed = (Math.random() - 0.5) * 0.02; // Disabled rotation
            });

            // Start animation loop
            startAnimation();
        } else {
            // Pause and arrange
            setIsPaused(true);
            arrangeBubblesAlphabetically();
        }
    };

    // Stop animation
    const stopAnimation = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = 0;
        }
    };

    // Cleanup
    const cleanup = () => {
        stopAnimation();
        if (animationQueueRef.current) {
            animationQueueRef.current.kill();
            animationQueueRef.current = null;
        }
        if (arrangementQueueRef.current) {
            arrangementQueueRef.current.kill();
            arrangementQueueRef.current = null;
        }
    };

    return {
        animationRef,
        animationQueueRef,
        arrangementQueueRef,
        startAnimation,
        stopAnimation,
        arrangeBubblesAlphabetically,
        toggleArrangement,
        cleanup,
    };
};
