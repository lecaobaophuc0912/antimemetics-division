import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Navigation } from '../../components/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslations } from '../../hooks/useTranslations';
import { useEffect, useState, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import * as fabric from 'fabric';
import { queue } from 'async';
import { ANIMATION_CONFIG, Bubble, useBubbleAnimation } from '../../hooks/useBubbleAnimation';
import { mockUsers, useFabricObjects } from '../../hooks/useFabricObjects';
import { useCanvas } from '@/hooks/useCanvas';

export type MessengerBubbleProps = {
    onBubbleClick: (info: ChatBasicInfo) => void
}

export interface ChatBasicInfo {
    name: string;
    avatar: string;
    id: string;
}

export const MessengerBubble: React.FC<MessengerBubbleProps> = ({ onBubbleClick }) => {
    const { user } = useAuth();
    const t = useTranslations('messenger');
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [isArranging, setIsArranging] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const animationRef = useRef<number>(0);
    const { initAnimationQueue, initArrangementQueue, initAnimation } = useBubbleAnimation();
    const { initializeCanvas } = useCanvas();
    const { createInitialBubbles } = useFabricObjects();
    // Animation queue với async.js để tránh lag
    const animationQueueRef = useRef<any>(null);
    // Arrangement queue riêng biệt cho việc sắp xếp bubbles
    const arrangementQueueRef = useRef<any>(null);
    const cleanupRef = useRef<any>(null);
    const animateRef = useRef<any>(null);

    const [chatBasicInfo, setChatBasicInfo] = useState<ChatBasicInfo>({
        name: '',
        avatar: '',
        id: ''
    })


    // Khởi tạo Fabric.js canvas
    useEffect(() => {
        const interval = setInterval(() => {
            if (!canvasRef.current) return;

            clearInterval(interval);

            const canvas = canvasRef.current;
            // Nếu container đã sẵn sàng, khởi tạo ngay
            const initializeCanvasResult = initializeCanvas(canvas);
            if (initializeCanvasResult) {
                fabricCanvasRef.current = initializeCanvasResult.fabricCanvasRef;
                cleanupRef.current = initializeCanvasResult.cleanup;
            }
        }, 10);

    }, []);

    useEffect(() => {
        return () => {
            if (cleanupRef.current) {
                cleanupRef.current();
            }
        };
    }, []);

    // Tạo bong bóng ban đầu


    // Khởi tạo 2 queue riêng biệt
    useEffect(() => {
        // Queue 1: Cho animation bình thường (concurrency cao)
        // animationQueueRef.current = initAnimationQueue();

        return () => {
            // Cleanup cả 2 queue khi component unmount
            if (animationQueueRef.current) {
                animationQueueRef.current.kill();
            }
            if (arrangementQueueRef.current) {
                arrangementQueueRef.current.kill();
            }
        };
    }, []);

    // Hàm sắp xếp bubbles theo alphabet với queued animation
    const arrangeBubblesAlphabetically = useCallback(() => {
        if (!fabricCanvasRef.current || bubbles.length === 0) return;

        const canvas = fabricCanvasRef.current;
        const rect = canvas.getElement().getBoundingClientRect();

        // Log arrangement start

        setIsArranging(true);
        // Đặt paused ngay để cập nhật UI sang trạng thái Resume
        setIsPaused(true);

        // Sắp xếp bubbles theo tên alphabet
        const sortedBubbles = [...bubbles].sort((a, b) => a.userName.localeCompare(b.userName));

        // Cố định kích thước cho tất cả bubble
        const uniformSize = 120;
        const padding = 20;
        const cols = Math.floor(rect.width / (uniformSize + padding));
        const rows = Math.ceil(sortedBubbles.length / cols);

        // Tính toán vị trí start để center grid
        const gridWidth = cols * (uniformSize + padding) - padding;
        const gridHeight = rows * (uniformSize + padding) - padding;
        const startX = (rect.width - gridWidth) / 2 + uniformSize / 2;
        const startY = (rect.height - gridHeight) / 2 + uniformSize / 2;

        // Clear arrangement queue trước khi thêm task mới
        if (arrangementQueueRef.current) {
            arrangementQueueRef.current.kill();
        }

        // Tạo queue mới cho arrangement
        arrangementQueueRef.current = initArrangementQueue();

        // Thêm animation tasks vào queue
        sortedBubbles.forEach((bubble, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const targetX = startX + col * (uniformSize + padding);
            const targetY = startY + row * (uniformSize + padding);
            // Push task vào queue ngay lập tức - không delay

            arrangementQueueRef.current.push({
                bubble,
                targetX,
                targetY,
                canvas
            });
        });

        // Khi tất cả task hoàn tất, chuyển sang trạng thái paused (để UI hiển thị resume)
        arrangementQueueRef.current.drain(() => {
            setIsArranging(false);
            setIsPaused(true);
        });

        // Thêm error handling cho queue
        arrangementQueueRef.current.error((err: any) => {
            setIsArranging(false);
            setIsPaused(false);
        });
    }, [bubbles]);

    // Hàm toggle animation và sắp xếp với debounce
    const toggleArrangement = useCallback(() => {
        // Debounce để tránh spam click - chỉ block khi đang arranging
        if (isArranging) {
            return;
        }

        if (!isPaused) {
            arrangeBubblesAlphabetically();
        } else {

            if (arrangementQueueRef.current) {
                arrangementQueueRef.current.kill();
                arrangementQueueRef.current = null;
            }

            // Reset tất cả bubbles về trạng thái floating
            bubbles.forEach(b => {
                b.isLocked = false;
                b.isArranging = false;
                b.isMarkedDone = false; // Reset flag done

                // If previous speeds exist use them; otherwise randomize gentle speeds
                if (typeof b.prevSpeedX === 'number') {
                    b.speedX = b.prevSpeedX as number;
                } else {
                    b.speedX = (Math.random() - 0.5) * 0.8;
                }
                if (typeof b.prevSpeedY === 'number') {
                    b.speedY = b.prevSpeedY as number;
                } else {
                    b.speedY = (Math.random() - 0.5) * 0.8;
                }

                // Comment rotation để giảm lag
                // b.rotationSpeed = (Math.random() - 0.5) * 2;

                b.prevSpeedX = undefined;
                b.prevSpeedY = undefined;
            });

            setIsPaused(false);
            setIsArranging(false);
        }
    }, [isArranging, isPaused, bubbles, arrangeBubblesAlphabetically]);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (fabricCanvasRef.current) {
                clearInterval(interval);
                // Đảm bảo canvas đã được khởi tạo hoàn toàn
                const initialBubbles = await createInitialBubbles(fabricCanvasRef.current, mockUsers);
                setBubbles(initialBubbles);
            }
        }, 10);
    }, [fabricCanvasRef]);


    // Animation loop với Fabric.js
    useEffect(() => {
        // if (!fabricCanvasRef.current || bubbles.length === 0) return;


        // const { animationRef } = initAnimation(fabricCanvasRef.current, bubbles);
        // animateRef.current = animationRef;

        // return () => {
        //     if (animateRef.current) {
        //         cancelAnimationFrame(animateRef.current);
        //     }
        // };
    }, [bubbles]); // Bỏ isAnimating dependency để animation luôn chạy

    // Event handlers
    useEffect(() => {
        if (!fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;

        const handleClick = (e: any) => {
            const clickedObj = e.target;

            if (clickedObj && clickedObj.type === 'group') {
                // Lấy thông tin bubble từ custom properties
                const userId = (clickedObj as any).userId;
                const userName = (clickedObj as any).userName;
                const avatarUrl = (clickedObj as any).avatarUrl;

                if (userId !== undefined && userId !== null) {
                    console.log(clickedObj);
                    onBubbleClick({
                        name: userName,
                        avatar: avatarUrl,
                        id: userId
                    });
                    // TODO: Implement chat opening logic here
                    // Example: openChat(userId, userName);
                }
            }
        };

        canvas.on('mouse:down', handleClick);

        return () => {
            canvas.off('mouse:down', handleClick);
        };
    }, [bubbles]);

    // Cleanup effect tổng thể khi component unmount
    useEffect(() => {
        return () => {
            // Cancel animation frame
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            // Dispose fabric canvas
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.dispose();
                fabricCanvasRef.current = null;
            }

            // Cleanup cả 2 queue
            if (animationQueueRef.current) {
                animationQueueRef.current.kill();
            }
            if (arrangementQueueRef.current) {
                arrangementQueueRef.current.kill();
            }

            // Clear bubbles
            setBubbles([]);
        };
    }, []);

    return (
        <main className="relative z-10">
            {/* Fabric.js Canvas */}
            <div className="relative w-full h-[calc(100vh - 66px)]">
                <canvas
                    onLoad={() => {

                    }}
                    ref={canvasRef}
                    className="w-full h-full block"
                    style={{
                        display: 'block',
                    }}
                />

                {/* Start/Stop Button - Positioned inside canvas at top-right corner */}
                <button
                    onClick={toggleArrangement}
                    className="absolute top-4 right-4 z-20 w-12 h-12 bg-purple-600/90 hover:bg-purple-700 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-purple-500/50 backdrop-blur-sm border border-purple-400/30 flex items-center justify-center group"
                    title={!isArranging && !isPaused ? 'Pause & Arrange A-Z' : isArranging ? 'Arranging...' : 'Resume Floating'}
                >
                    {!isArranging && !isPaused ? (
                        // Stop icon
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <rect x="6" y="4" width="2" height="12" rx="1" />
                            <rect x="12" y="4" width="2" height="12" rx="1" />
                        </svg>
                    ) : (
                        // Play icon
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.5 4.5L15.5 10L6.5 15.5V4.5Z" />
                        </svg>
                    )}
                </button>
            </div>

        </main>
    );
}

