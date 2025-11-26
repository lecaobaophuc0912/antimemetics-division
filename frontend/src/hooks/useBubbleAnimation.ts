import * as fabric from 'fabric';
import { queue } from 'async';

// Animation Configuration Constants
export const ANIMATION_CONFIG = {
    QUEUE_CONCURRENCY: 4,        // Các worker để animation chạy liên tục
    QUEUE_ARRANGE_CONCURRENCY: 10,        // Các worker để animation chạy liên tục
    STAGGER_DELAY: 0,            // Không delay giữa các bubble
    ANIMATION_DURATION: 600,     // Thời gian animation (ms)
    PAUSE_DELAY: 50,             // Delay trước khi arrange (ms)
    TARGET_FPS: 60,              // Target frame rate
    SHIMMER_UPDATE_RATE: 0.1,    // Tỷ lệ update shimmer (10%)
    ENABLE_LOGGING: true,        // Bật/tắt logging để debug
} as const;

export interface Bubble {
    id: number;
    fabricObject: fabric.Group;
    speedX: number;
    speedY: number;
    rotationSpeed: number;
    shimmer: number;
    avatarUrl?: string | null;
    userName: string;
    userId: string;
    color: string;
    // New flags for arrangement/locking behavior
    isArranging?: boolean;
    isLocked?: boolean;
    prevSpeedX?: number;
    prevSpeedY?: number;
    // Flag để track trạng thái done trong arrangement
    isMarkedDone?: boolean;
}

export const useBubbleAnimation = () => {

    const initAnimationQueue = () => {
        return queue(async (task: any) => {
            return new Promise<void>((resolve) => {
                const { bubble, targetX, targetY, canvas } = task;
                const bubbleId = `bubble-${bubble.id}`;

                // Dừng chuyển động ngay lập tức
                bubble.speedX = 0;
                bubble.speedY = 0;
                // Comment rotation để giảm lag
                // bubble.rotationSpeed = 0;

                // Animate với callback
                bubble.fabricObject.animate({
                    left: targetX,
                    top: targetY,
                    angle: 0,
                }, {
                    duration: ANIMATION_CONFIG.ANIMATION_DURATION,
                    easing: fabric.util.ease.easeOutQuart,
                    onChange: () => {

                        if (canvas && canvas.renderAll) {
                            canvas.requestRenderAll();
                        }
                    },
                    onComplete: () => {
                        bubble.fabricObject.setCoords();
                        resolve(); // Hoàn thành task
                    }
                });
            });
        }, ANIMATION_CONFIG.QUEUE_CONCURRENCY);
    }

    const initArrangementQueue = () => {
        return queue(async (task: any) => {
            return new Promise<void>((resolve) => {
                const { bubble, targetX, targetY, canvas } = task;

                // Lock bubble cho arrangement
                bubble.isArranging = true;
                bubble.isLocked = true;
                bubble.prevSpeedX = bubble.speedX;
                bubble.prevSpeedY = bubble.speedY;
                bubble.speedX = 0;
                bubble.speedY = 0;
                // Comment rotation để giảm lag
                // bubble.rotationSpeed = 0;

                // Thêm flag để track trạng thái done
                (bubble as any).isMarkedDone = false;

                // Track thời gian bắt đầu animation
                const startTime = Date.now();
                const totalDuration = ANIMATION_CONFIG.ANIMATION_DURATION;

                // Animate với callback
                bubble.fabricObject.animate({
                    left: targetX,
                    top: targetY,
                    angle: 0,
                }, {
                    duration: totalDuration,
                    easing: fabric.util.ease.easeOutQuart,
                    onChange: (progress: number) => {
                        // progress là số từ 0 đến 1 (0% đến 100%)
                        const elapsedTime = Date.now() - startTime;
                        const progressPercent = elapsedTime / totalDuration;

                        // Debug: log progress mỗi 20% để theo dõi
                        if (Math.floor(progressPercent * 5) !== Math.floor(((progressPercent - 0.01) * 5))) {

                        }

                        // Nếu đã chạy được 50% thời gian và chưa được mark done
                        if (progressPercent >= 0.5 && !(bubble as any).isMarkedDone) {
                            (bubble as any).isMarkedDone = true;


                            // Mark bubble là done và resolve promise
                            resolve();
                        }

                        // Render canvas
                        if (canvas && canvas.renderAll) {
                            canvas.requestRenderAll();
                        }
                    },
                    onComplete: () => {
                        // Fallback nếu onChange không trigger đủ hoặc chưa done
                        if (!(bubble as any).isMarkedDone) {

                            (bubble as any).isMarkedDone = true;
                            resolve();
                        }

                        bubble.fabricObject.setCoords();

                        // Keep bubble locked at arranged position
                        bubble.isArranging = false;
                        bubble.speedX = 0;
                        bubble.speedY = 0;
                        // Comment rotation để giảm lag
                        // bubble.rotationSpeed = 0;
                    }
                });
            });
        }, ANIMATION_CONFIG.QUEUE_ARRANGE_CONCURRENCY); // Concurrency config
    }

    const initAnimation = (fabricCanvasRef: fabric.Canvas, bubbles: Bubble[]) => {
        let animationRef;

        const animate = (currentTime: number) => {
            try {
                const canvas = fabricCanvasRef;
                let lastTime = 0;
                const frameInterval = 1000 / ANIMATION_CONFIG.TARGET_FPS;

                if (currentTime - lastTime >= frameInterval) {
                    const rect = canvas.getElement().getBoundingClientRect()

                    // Batch operations để giảm số lần renderAll
                    let needsRender = false;

                    bubbles.forEach(bubble => {
                        const obj = bubble.fabricObject;
                        // Nếu bubble đang bị lock do arrangement, không cập nhật physics cho bubble đó
                        if (bubble.isLocked) {
                            return;
                        }

                        let newX = (obj.left || 0) + bubble.speedX;
                        let newY = (obj.top || 0) + bubble.speedY;
                        let newSpeedX = bubble.speedX;
                        let newSpeedY = bubble.speedY;

                        // Di chuyển trước, sau đó hiệu chỉnh nếu vượt biên theo bounding box thật
                        // Comment rotation để giảm lag
                        obj.set({ left: newX, top: newY /*, angle: (obj.angle || 0) + bubble.rotationSpeed */ });
                        obj.setCoords();
                        needsRender = true;
                        const br = obj.getBoundingRect();
                        const epsilon = 0.5;
                        let adjustX = 0;
                        let adjustY = 0;
                        let bouncedX = false;
                        let bouncedY = false;

                        if (br.left < 0) {
                            adjustX = -br.left + epsilon;
                            bouncedX = true;
                        } else if (br.left + br.width > rect.width) {
                            adjustX = rect.width - (br.left + br.width) - epsilon;
                            bouncedX = true;
                        }

                        if (br.top < 0) {
                            adjustY = -br.top + epsilon;
                            bouncedY = true;
                        } else if (br.top + br.height > rect.height) {
                            adjustY = rect.height - (br.top + br.height) - epsilon;
                            bouncedY = true;
                        }

                        if (adjustX !== 0 || adjustY !== 0) {
                            obj.set({ left: (obj.left || 0) + adjustX, top: (obj.top || 0) + adjustY });
                            if (bouncedX) newSpeedX = -newSpeedX;
                            if (bouncedY) newSpeedY = -newSpeedY;
                        }

                        // Kiểm tra va chạm với các bubble khác (tối ưu performance)
                        const currentBubble = bubble;
                        const currentRadius = 60; // Fixed radius for all bubbles (120/2)
                        const currentX = obj.left || 0;
                        const currentY = obj.top || 0;

                        // Chỉ kiểm tra với bubbles có index lớn hơn để tránh kiểm tra trùng lặp
                        for (let j = bubbles.indexOf(bubble) + 1; j < bubbles.length; j++) {
                            const otherBubble = bubbles[j];
                            // Bỏ qua va chạm nếu otherBubble đang lock (để giữ vị trí hàng)
                            if (otherBubble.isLocked) continue;
                            const otherObj = otherBubble.fabricObject;
                            const otherX = otherObj.left || 0;
                            const otherY = otherObj.top || 0;

                            // Quick distance check trước khi tính sqrt
                            const dx = currentX - otherX;
                            const dy = currentY - otherY;
                            const distanceSquared = dx * dx + dy * dy;
                            const minDistance = 125; // currentRadius + otherRadius + 5px padding
                            const minDistanceSquared = minDistance * minDistance;

                            if (distanceSquared < minDistanceSquared) {
                                const distance = Math.sqrt(distanceSquared);
                                if (distance > 0) { // Tránh chia cho 0
                                    const angle = Math.atan2(dy, dx);
                                    const overlap = minDistance - distance;

                                    // Đẩy 2 bubble ra xa nhau
                                    const pushX = Math.cos(angle) * (overlap * 0.5);
                                    const pushY = Math.sin(angle) * (overlap * 0.5);

                                    // Cập nhật vị trí
                                    obj.set({
                                        left: currentX + pushX,
                                        top: currentY + pushY
                                    });
                                    otherObj.set({
                                        left: otherX - pushX,
                                        top: otherY - pushY
                                    });

                                    // Tính toán phản lực (simplified)
                                    const relativeVelocityX = newSpeedX - otherBubble.speedX;
                                    const relativeVelocityY = newSpeedY - otherBubble.speedY;
                                    const velocityAlongNormal = relativeVelocityX * Math.cos(angle) + relativeVelocityY * Math.sin(angle);

                                    if (velocityAlongNormal < 0) {
                                        const restitution = 0.8;
                                        const impulse = -(1 + restitution) * velocityAlongNormal;
                                        const impulseX = impulse * Math.cos(angle);
                                        const impulseY = impulse * Math.sin(angle);

                                        newSpeedX += impulseX;
                                        newSpeedY += impulseY;
                                        otherBubble.speedX -= impulseX;
                                        otherBubble.speedY -= impulseY;
                                    }
                                }
                            }
                        }

                        // Add natural movement (giảm tần suất)
                        if (Math.random() < 0.05) {
                            newSpeedX += (Math.random() - 0.5) * 0.01;
                            newSpeedY += (Math.random() - 0.5) * 0.01;
                        }

                        // Limit speed
                        newSpeedX = Math.max(-1.5, Math.min(1.5, newSpeedX));
                        newSpeedY = Math.max(-1.5, Math.min(1.5, newSpeedY));

                        // Update shimmer effect - tối ưu performance với update ít thường xuyên hơn
                        if (Math.random() < ANIMATION_CONFIG.SHIMMER_UPDATE_RATE) { // Update shimmer theo config
                            const shimmerCircle = obj.getObjects()?.find(o => (o as any).name === 'shimmer');
                            if (shimmerCircle) {
                                bubble.shimmer = (bubble.shimmer + 2) % 100; // Tăng step để bù đắp việc update ít hơn
                                const angle = (bubble.shimmer / 100) * Math.PI * 2;
                                const radius = 60; // Fixed radius cho performance
                                const x = Math.cos(angle) * 18; // radius * 0.3 = 60 * 0.3 = 18
                                const y = Math.sin(angle) * 18;

                                const gradient = new fabric.Gradient({
                                    type: 'radial',
                                    coords: { r1: 0, r2: 48, x1: x, y1: y, x2: x, y2: y }, // r2 = radius * 0.8 = 48
                                    colorStops: [
                                        { offset: 0, color: 'rgba(255,255,255,0.8)' },
                                        { offset: 0.7, color: 'rgba(255,255,255,0.3)' },
                                        { offset: 1, color: 'transparent' },
                                    ],
                                });
                                // Không update shimmer khi bubble đang lock để giảm conflict render
                                if (!bubble.isLocked) {
                                    shimmerCircle.set({ fill: gradient });
                                }
                            }
                        }

                        // Update speed
                        bubble.speedX = newSpeedX;
                        bubble.speedY = newSpeedY;
                    });

                    // Chỉ renderAll khi thực sự cần thiết
                    if (needsRender) {
                        canvas.requestRenderAll();
                    }
                    lastTime = currentTime;
                }

                animationRef = requestAnimationFrame(animate);
            } catch (ex) {
                console.error(ex);
            }
        };
        animationRef = requestAnimationFrame(animate);
        return {
            animationRef,
        };
    }



    return {
        initAnimationQueue,
        initArrangementQueue,
        initAnimation,
    };
};
