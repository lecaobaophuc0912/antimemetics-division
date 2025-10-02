import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Navigation } from '../../components/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslations } from '../../hooks/useTranslations';
import { useEffect, useState, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import * as fabric from 'fabric';
import { queue } from 'async';

// Animation Configuration Constants
const ANIMATION_CONFIG = {
    QUEUE_CONCURRENCY: 4,        // Các worker để animation chạy liên tục
    QUEUE_ARRANGE_CONCURRENCY: 10,        // Các worker để animation chạy liên tục
    STAGGER_DELAY: 0,            // Không delay giữa các bubble
    ANIMATION_DURATION: 600,     // Thời gian animation (ms)
    PAUSE_DELAY: 50,             // Delay trước khi arrange (ms)
    TARGET_FPS: 60,              // Target frame rate
    SHIMMER_UPDATE_RATE: 0.1,    // Tỷ lệ update shimmer (10%)
    ENABLE_LOGGING: true,        // Bật/tắt logging để debug
} as const;

// Animation Logging System
class AnimationLogger {
    private static activeAnimations = new Set<string>();
    private static queuedTasks = 0;
    private static completedTasks = 0;
    private static maxConcurrent = 0;

    static logStart(bubbleId: string, userName: string) {
        if (!ANIMATION_CONFIG.ENABLE_LOGGING) return;

        this.activeAnimations.add(bubbleId);
        this.queuedTasks--;
        this.completedTasks++;
        const currentConcurrent = this.activeAnimations.size;
        this.maxConcurrent = Math.max(this.maxConcurrent, currentConcurrent);
    }

    static logEnd(bubbleId: string, userName: string) {
        if (!ANIMATION_CONFIG.ENABLE_LOGGING) return;

        this.activeAnimations.delete(bubbleId);
        this.completedTasks++;


    }

    static logQueue(bubbleId: string, userName: string) {
        if (!ANIMATION_CONFIG.ENABLE_LOGGING) return;

        this.queuedTasks++;

    }

    static logQueueReset() {
        if (!ANIMATION_CONFIG.ENABLE_LOGGING) return;



        this.activeAnimations.clear();
        this.queuedTasks = 0;
        this.completedTasks = 0;
        this.maxConcurrent = 0;
    }

    static logArrangementStart(totalBubbles: number) {
        if (!ANIMATION_CONFIG.ENABLE_LOGGING) return;


        this.logQueueReset();
    }
}

interface Bubble {
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

interface User {
    id: string;
    name: string;
    avatarUrl?: string | null;
    color: string;
}

export default function MessengerPage() {
    const { user } = useAuth();
    const t = useTranslations('messenger');
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [isHovering, setIsHovering] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(true); // legacy, not used to stop loop anymore
    const [isArranging, setIsArranging] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const animationRef = useRef<number>(0);

    // Animation queue với async.js để tránh lag
    const animationQueueRef = useRef<any>(null);
    // Arrangement queue riêng biệt cho việc sắp xếp bubbles
    const arrangementQueueRef = useRef<any>(null);

    // Mock data cho các user có thể chat - 20 users với avatar tái sử dụng
    const mockUsers = useMemo(() => [
        { id: '1', name: 'Alice Chen', avatarUrl: '/avatars/1.jpg', color: '#FF6B9D' },
        { id: '2', name: 'Bob Smith', avatarUrl: '/avatars/2.jpg', color: '#4ECDC4' },
        { id: '3', name: 'Carol Johnson', avatarUrl: '/avatars/3.jpg', color: '#45B7D1' },
        { id: '4', name: 'David Wilson', avatarUrl: '/avatars/4.jpg', color: '#96CEB4' },
        { id: '5', name: 'Eva Martinez', avatarUrl: '/avatars/5.jpg', color: '#FFEAA7' },
        { id: '6', name: 'Frank Brown', avatarUrl: '/avatars/6.jpg', color: '#DDA0DD' },
        { id: '7', name: 'Grace Lee', avatarUrl: '/avatars/7.jpg', color: '#98D8C8' },
        { id: '8', name: 'Henry Davis', avatarUrl: '/avatars/8.jpg', color: '#F7DC6F' },
        { id: '9', name: 'Iris Garcia', avatarUrl: '/avatars/9.jpg', color: '#BB8FCE' },
        { id: '10', name: 'Jack Miller', avatarUrl: '/avatars/10.jpg', color: '#85C1E9' },
        { id: '11', name: 'Kate Wilson', avatarUrl: '/avatars/1.jpg', color: '#F8C471' },
        { id: '12', name: 'Liam Taylor', avatarUrl: '/avatars/2.jpg', color: '#D7BDE2' },
        { id: '13', name: 'Maya Chen', avatarUrl: '/avatars/3.jpg', color: '#A9DFBF' },
        { id: '14', name: 'Noah Parker', avatarUrl: '/avatars/4.jpg', color: '#FAD7A0' },
        { id: '15', name: 'Olivia Davis', avatarUrl: '/avatars/5.jpg', color: '#AED6F1' },
        { id: '16', name: 'Paul Rodriguez', avatarUrl: '/avatars/6.jpg', color: '#F5B7B1' },
        { id: '17', name: 'Quinn Lee', avatarUrl: '/avatars/7.jpg', color: '#D5A6BD' },
        { id: '18', name: 'Ryan Martinez', avatarUrl: '/avatars/8.jpg', color: '#A3E4D7' },
        { id: '19', name: 'Sofia Brown', avatarUrl: '/avatars/9.jpg', color: '#F9E79F' },
        { id: '20', name: 'Tyler Johnson', avatarUrl: '/avatars/10.jpg', color: '#FADBD8' },
    ], []);

    // Khởi tạo Fabric.js canvas
    useEffect(() => {

        const interval = setInterval(() => {
            if (!canvasRef.current) return;

            clearInterval(interval);

            const canvas = canvasRef.current;
            const container = canvas.parentElement;
            if (!container) return;

            // Đảm bảo container đã có kích thước
            const rect = container.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                // Nếu container chưa có kích thước, đợi một chút
                const timer = setTimeout(() => {
                    if (canvasRef.current && canvasRef.current.parentElement) {
                        const newRect = canvasRef.current.parentElement.getBoundingClientRect();
                        if (newRect.width > 0 && newRect.height > 0) {
                            initializeCanvas();
                        }
                    }
                }, 100);
                return () => clearTimeout(timer);
            }

            // Nếu container đã sẵn sàng, khởi tạo ngay
            initializeCanvas();

            function initializeCanvas() {
                if (!canvasRef.current) {
                    console.warn('Canvas ref not available');
                    return;
                }

                const canvas = canvasRef.current;
                const container = canvas.parentElement;
                if (!container) {
                    console.warn('Canvas container not found');
                    return;
                }

                const rect = container.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) {
                    console.warn('Container has no dimensions:', rect);
                    return;
                }

                canvas.width = rect.width;
                canvas.height = rect.height;

                // Dispose canvas cũ nếu có
                if (fabricCanvasRef.current) {

                    fabricCanvasRef.current.dispose();
                }

                try {
                    const fabricCanvas = new fabric.Canvas(canvas, {
                        backgroundColor: 'transparent',
                        selection: false,
                        interactive: false,
                        renderOnAddRemove: false,
                    });

                    fabricCanvasRef.current = fabricCanvas;

                } catch (error) {
                    console.error('Failed to initialize canvas:', error);
                    return;
                }

                // Set canvas size
                const resizeCanvas = () => {
                    if (!canvasRef.current || !fabricCanvasRef.current) return;

                    const container = canvasRef.current.parentElement;
                    if (container) {
                        const rect = container.getBoundingClientRect();
                        // Set cả canvas element và Fabric.js canvas
                        canvasRef.current.width = rect.width;
                        canvasRef.current.height = rect.height;
                        fabricCanvasRef.current.setDimensions({
                            width: rect.width,
                            height: rect.height,
                        });
                        fabricCanvasRef.current.renderAll();
                    }
                };

                // Resize ngay lập tức và sau khi DOM đã render
                setTimeout(resizeCanvas, 0);
                window.addEventListener('resize', resizeCanvas);

                // Cleanup function
                return () => {
                    window.removeEventListener('resize', resizeCanvas);
                    if (fabricCanvasRef.current) {
                        fabricCanvasRef.current.dispose();
                        fabricCanvasRef.current = null;
                    }
                };
            }
        }, 10);

    }, []);

    // Tạo bong bóng ban đầu
    const createInitialBubbles = useCallback(async () => {
        if (!fabricCanvasRef.current) return [];

        const canvas = fabricCanvasRef.current;
        const rect = canvas.getElement().getBoundingClientRect();
        const initialBubbles = [];
        let index = 0;
        for (const mockUser of mockUsers) {
            const size = 120; // Kích thước cố định cho tất cả bubble
            const x = Math.random() * (rect.width - size);
            const y = Math.random() * (rect.height - size);
            const strokeWidth = 2;

            // Danh sách phần tử trong group. Khi có avatar, chỉ push FabricImage
            const elements: fabric.Object[] = [];

            // Tạo group với tất cả elements cơ bản

            // Load avatar using fabric.util.loadImage for better performance
            if (mockUser.avatarUrl) {
                try {
                    const img = await fabric.util.loadImage(mockUser.avatarUrl, {
                        crossOrigin: 'use-credentials'
                    });
                    // Create FabricImage from loaded HTMLImageElement
                    const fabricImg = new fabric.FabricImage(img, {
                        left: 0,
                        top: 0,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Giả định: mọi ảnh là hình vuông và nên lấp đầy toàn bộ bubble (cạnh ảnh = đường kính circle)
                    const r = size / 2; // bán kính bubble
                    const targetImageSize = size; // cạnh ảnh = đường kính circle
                    const scale = targetImageSize / Math.max(img.width, img.height);
                    const clipRadius = (size / 2) / scale; // vì clipPath sẽ bị scale cùng với image

                    fabricImg.set({
                        scaleX: scale,
                        scaleY: scale,
                        objectCaching: true, // Bật cache để tăng performance
                        clipPath: new fabric.Circle({
                            radius: clipRadius,
                            originX: 'center',
                            originY: 'center',
                            absolutePositioned: false,
                        }),
                    });

                    // Đảm bảo image được center trong group
                    fabricImg.set({
                        left: 0,
                        top: 0,
                        originX: 'center',
                        originY: 'center',
                    });

                    // 1) Ảnh
                    elements.push(fabricImg);

                    // 2) Gradient light overlay (shimmer) để tạo hiệu ứng ánh sáng
                    const lightOverlay = new fabric.Circle({
                        left: 0,
                        top: 0,
                        radius: r,
                        fill: new fabric.Gradient({
                            type: 'radial',
                            coords: { r1: 0, r2: r, x1: 0, y1: 0, x2: 0, y2: 0 },
                            colorStops: [
                                { offset: 0, color: 'rgba(255,255,255,0.85)' },
                                { offset: 0.6, color: 'rgba(255,255,255,0.35)' },
                                { offset: 1, color: 'transparent' },
                            ],
                        }),
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                        opacity: 0.35,
                        objectCaching: false,
                        name: 'shimmer',
                    });
                    elements.push(lightOverlay);

                    // 3) Tên nhỏ phía dưới ảnh
                    const nameLabel = new fabric.FabricText(mockUser.name, {
                        left: 0,
                        top: (size / 2) + 8, // bên dưới mép ảnh một chút
                        originX: 'center',
                        originY: 'top',
                        fontFamily: 'Orbitron, "Courier New", monospace',
                        fontWeight: 'bold',
                        fontSize: Math.max(10, size * 0.1), // Tăng font size để rõ hơn
                        fill: 'white',
                        selectable: false,
                        evented: false,
                        stroke: 'rgba(0,0,0,0.8)', // Tăng độ đậm stroke
                        strokeWidth: 2, // Tăng stroke width
                        shadow: new fabric.Shadow({
                            color: 'rgba(0,0,0,0.7)',
                            blur: 4,
                            offsetX: 1,
                            offsetY: 1
                        }),
                        objectCaching: true, // Bật cache
                        paintFirst: 'stroke', // Vẽ stroke trước để text rõ hơn
                        name: 'nameLabel',
                    });
                    elements.push(nameLabel);

                    // Thêm viền tròn theo màu user để tạo stroke cho ảnh
                    const borderCircle = new fabric.Circle({
                        left: 0,
                        top: 0,
                        radius: r,
                        fill: 'transparent',
                        stroke: mockUser.color,
                        strokeWidth,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                        name: 'border',
                    });
                    elements.push(borderCircle);

                    // 4) Badge thông báo tin nhắn mới (màu đỏ, hình tròn) - ĐẶT CUỐI CÙNG để có z-index cao nhất
                    const messageCount = Math.floor(Math.random() * 150) + 1; // Random 1-150 để test
                    const badgeText = messageCount > 99 ? '99+' : messageCount.toString();
                    const badgeSize = Math.max(32, size * 0.24); // Tăng gấp đôi kích thước
                    const badgeFontSize = Math.max(12, badgeSize * 0.4); // Tăng font size tương ứng

                    // Tính vị trí badge để đè lên stroke của avatar
                    const badgeX = (size / 2) - (badgeSize / 2) - 2; // Góc phải với padding nhỏ hơn
                    const badgeY = -(size / 2) + (badgeSize / 2) + 2; // Góc trên với padding nhỏ hơn

                    const badge = new fabric.Circle({
                        left: badgeX,
                        top: badgeY,
                        radius: badgeSize / 2,
                        fill: '#ef4444', // red-500
                        stroke: '#dc2626', // red-600
                        strokeWidth: 1,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                        name: 'badge',
                    });
                    elements.push(badge);

                    const badgeTextObj = new fabric.FabricText(badgeText, {
                        left: badgeX,
                        top: badgeY,
                        originX: 'center',
                        originY: 'center',
                        fontFamily: 'Orbitron, "Courier New", monospace',
                        fontWeight: '900', // Tăng độ đậm font
                        fontSize: badgeFontSize,
                        fill: 'white',
                        selectable: false,
                        evented: false,
                        stroke: 'rgba(220, 38, 38, 0.3)', // Thêm stroke nhẹ màu đỏ
                        strokeWidth: 0.5,
                        objectCaching: true, // Bật cache
                        paintFirst: 'fill', // Vẽ fill trước cho text rõ
                        name: 'badgeText',
                    });
                    elements.push(badgeTextObj);
                } catch (error) {
                    console.error(`Failed to load image for ${mockUser.name}:`, error);
                    // Fallback to text if image loading fails
                    createTextFallback();
                }


            } else {
                // Không có avatar: tạo circle + shimmer + text
                const circle = new fabric.Circle({
                    left: 0,
                    top: 0,
                    radius: size / 2,
                    fill: `rgba(${parseInt(mockUser.color.slice(1, 3), 16)}, ${parseInt(mockUser.color.slice(3, 5), 16)}, ${parseInt(mockUser.color.slice(5, 7), 16)}, 0.3)`,
                    stroke: mockUser.color,
                    strokeWidth,
                    selectable: false,
                    evented: false,
                    originX: 'center',
                    originY: 'center',
                    shadow: new fabric.Shadow({
                        color: mockUser.color,
                        blur: 20,
                        offsetX: 0,
                        offsetY: 0,
                    }),
                });
                elements.push(circle);

                const shimmer = new fabric.Circle({
                    left: 0,
                    top: 0,
                    radius: size / 2,
                    fill: new fabric.Gradient({
                        type: 'radial',
                        coords: {
                            r1: 0,
                            r2: size / 2,
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 0,
                        },
                        colorStops: [
                            { offset: 0, color: 'rgba(255,255,255,0.8)' },
                            { offset: 0.7, color: 'rgba(255,255,255,0.3)' },
                            { offset: 1, color: 'transparent' },
                        ],
                    }),
                    originX: 'center',
                    originY: 'center',
                    selectable: false,
                    evented: false,
                    opacity: 0.4,
                    name: 'shimmer',
                });
                elements.push(shimmer);

                // Fallback text
                createTextFallback();

                // 4) Badge thông báo tin nhắn mới (màu đỏ, hình tròn) - ĐẶT CUỐI CÙNG để có z-index cao nhất
                const messageCount = Math.floor(Math.random() * 150) + 1; // Random 1-150 để test
                const badgeText = messageCount > 99 ? '99+' : messageCount.toString();
                const badgeSize = Math.max(32, size * 0.24); // Tăng gấp đôi kích thước
                const badgeFontSize = Math.max(12, badgeSize * 0.4); // Tăng font size tương ứng

                // Tính vị trí badge để đè lên stroke của bubble
                const badgeX = (size / 2) - (badgeSize / 2) - 2; // Góc phải với padding nhỏ hơn
                const badgeY = -(size / 2) + (badgeSize / 2) + 2; // Góc trên với padding nhỏ hơn

                const badge = new fabric.Circle({
                    left: badgeX,
                    top: badgeY,
                    radius: badgeSize / 2,
                    fill: '#ef4444', // red-500
                    stroke: '#dc2626', // red-600
                    strokeWidth: 1,
                    originX: 'center',
                    originY: 'center',
                    selectable: false,
                    evented: false,
                    name: 'badge',
                });
                elements.push(badge);

                const badgeTextObj = new fabric.FabricText(badgeText, {
                    left: badgeX,
                    top: badgeY,
                    originX: 'center',
                    originY: 'center',
                    fontFamily: 'Orbitron, "Courier New", monospace',
                    fontWeight: 'bold',
                    fontSize: badgeFontSize,
                    fill: 'white',
                    selectable: false,
                    evented: false,
                    name: 'badgeText',
                });
                elements.push(badgeTextObj);
            }

            // Helper: lấy 2 ký tự đầu cho avatar text
            function getInitials(fullName: string): string {
                const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
                if (parts.length >= 2) {
                    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                }
                const only = parts[0] || '';
                return (only.slice(0, 2)).toUpperCase();
            }

            // Helper function to create text fallback (initials inside bubble)
            function createTextFallback() {
                const initials = getInitials(mockUser.name || '');

                const maxDiameter = size * 0.85; // leave some padding inside the bubble
                const maxWidth = maxDiameter;
                const maxHeight = maxDiameter;

                let fontSize = size * 0.5; // lớn cho 2 ký tự
                const minFontSize = 12;

                const text = new fabric.FabricText(initials, {
                    fontSize,
                    fill: 'white',
                    fontWeight: '900', // Tăng độ đậm
                    fontFamily: 'Orbitron, "Courier New", monospace',
                    originX: 'center',
                    originY: 'center',
                    selectable: false,
                    evented: false,
                    textAlign: 'center',
                    stroke: 'rgba(0,0,0,0.8)', // Tăng độ đậm stroke
                    strokeWidth: Math.max(2, strokeWidth), // Tăng stroke width
                    objectCaching: true, // Bật cache
                    paintFirst: 'stroke', // Vẽ stroke trước
                    shadow: new fabric.Shadow({
                        color: 'rgba(0,0,0,0.6)',
                        blur: 3,
                        offsetX: 1,
                        offsetY: 1
                    }),
                });

                // Co chữ nếu vượt quá vùng tròn
                for (let i = 0; i < 10; i++) {
                    const textWidth = (text.width || 0) * (text.scaleX || 1);
                    const textHeight = (text.height || 0) * (text.scaleY || 1);
                    if (textWidth <= maxWidth && textHeight <= maxHeight) break;
                    fontSize = Math.max(minFontSize, fontSize * 0.9);
                    text.set({ fontSize });
                }

                elements.push(text);

                // Thêm tên đầy đủ dưới bubble
                const r = size / 2;
                const nameLabel = new fabric.FabricText(mockUser.name, {
                    left: 0,
                    top: r + 8,
                    originX: 'center',
                    originY: 'top',
                    fontFamily: 'Orbitron, "Courier New", monospace',
                    fontWeight: 'bold',
                    fontSize: Math.max(10, size * 0.1), // Tăng font size
                    fill: 'white',
                    selectable: false,
                    evented: false,
                    stroke: 'rgba(0,0,0,0.8)', // Tăng độ đậm stroke
                    strokeWidth: 2, // Tăng stroke width
                    shadow: new fabric.Shadow({
                        color: 'rgba(0,0,0,0.7)',
                        blur: 4,
                        offsetX: 1,
                        offsetY: 1
                    }),
                    objectCaching: true, // Bật cache
                    paintFirst: 'stroke', // Vẽ stroke trước
                    name: 'nameLabel',
                });
                elements.push(nameLabel);

                // 4) Badge thông báo tin nhắn mới (màu đỏ, hình tròn)
                const messageCount = Math.floor(Math.random() * 150) + 1; // Random 1-150 để test
                const badgeText = messageCount > 99 ? '99+' : messageCount.toString();
                const badgeSize = Math.max(32, size * 0.24); // Tăng gấp đôi kích thước
                const badgeFontSize = Math.max(12, badgeSize * 0.4); // Tăng font size tương ứng

                // Tính vị trí badge để đè lên stroke của avatar
                const badgeX = (size / 2) - (badgeSize / 2) - 2; // Góc phải với padding nhỏ hơn
                const badgeY = -(size / 2) + (badgeSize / 2) + 2; // Góc trên với padding nhỏ hơn

                const badge = new fabric.Circle({
                    left: badgeX,
                    top: badgeY,
                    radius: badgeSize / 2,
                    fill: '#ef4444', // red-500
                    stroke: '#dc2626', // red-600
                    strokeWidth: 1,
                    originX: 'center',
                    originY: 'center',
                    selectable: false,
                    evented: false,
                    name: 'badge',
                });
                elements.push(badge);

                const badgeTextObj = new fabric.FabricText(badgeText, {
                    left: badgeX,
                    top: badgeY,
                    originX: 'center',
                    originY: 'center',
                    fontFamily: 'Orbitron, "Courier New", monospace',
                    fontWeight: 'bold',
                    fontSize: badgeFontSize,
                    fill: 'white',
                    selectable: false,
                    evented: false,
                    name: 'badgeText',
                });
                elements.push(badgeTextObj);
            }

            const group = new fabric.Group(elements, {
                left: x,
                top: y,
                selectable: false,
                evented: true,
                originX: 'center',
                originY: 'center',
                objectCaching: true, // Bật cache cho group để tăng performance
                hoverCursor: 'pointer' // Tự động thay đổi cursor khi hover
                // Không thêm clipPath ở group khi dùng avatar để tránh double clip
            });

            // Thêm custom properties để identify bubble
            (group as any).bubbleId = index;
            (group as any).userName = mockUser.name;
            (group as any).userId = mockUser.id;

            // Đảm bảo group có kích thước đúng
            group.setCoords();

            // Thêm vào canvas
            canvas.add(group);
            fabricCanvasRef.current?.renderAll();

            initialBubbles.push({
                id: index,
                fabricObject: group,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                // Comment rotation để giảm lag - set 0 thay vì random
                rotationSpeed: 0,
                shimmer: Math.random() * 100,
                avatarUrl: mockUser.avatarUrl,
                userName: mockUser.name,
                userId: mockUser.id,
                color: mockUser.color,
            });
            index++;
        }

        return initialBubbles;
    }, [mockUsers]);

    // Khởi tạo 2 queue riêng biệt
    useEffect(() => {
        if (ANIMATION_CONFIG.ENABLE_LOGGING) {

        }

        // Queue 1: Cho animation bình thường (concurrency cao)
        animationQueueRef.current = queue(async (task: any) => {
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
        arrangementQueueRef.current = queue(async (task: any) => {
            return new Promise<void>((resolve) => {
                const { bubble, targetX, targetY, canvas } = task;
                const bubbleId = `arrange-${bubble.id}`;

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
                        AnimationLogger.logEnd(bubbleId, bubble.userName);

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
        const interval = setInterval(() => {
            if (fabricCanvasRef.current) {
                clearInterval(interval);
                // Đảm bảo canvas đã được khởi tạo hoàn toàn
                const timer = setTimeout(async () => {
                    if (fabricCanvasRef.current) {
                        const initialBubbles = await createInitialBubbles();
                        setBubbles(initialBubbles);
                    }
                }, 200); // Đợi canvas khởi tạo hoàn toàn

                return () => clearTimeout(timer);
            }
        }, 10);
    }, [fabricCanvasRef]);

    // Đảm bảo canvas được resize đúng cách
    useEffect(() => {
        if (fabricCanvasRef.current && canvasRef.current) {
            const container = canvasRef.current.parentElement;
            if (!container) return;

            const resizeCanvas = () => {
                const rect = container.getBoundingClientRect();
                const canvas = canvasRef.current!;
                const fabricCanvas = fabricCanvasRef.current!;

                // Set cả canvas element và Fabric.js canvas
                canvas.width = rect.width;
                canvas.height = rect.height;
                fabricCanvas.setDimensions({
                    width: rect.width,
                    height: rect.height,
                });
                fabricCanvas.renderAll();
            };

            // Resize ngay lập tức
            resizeCanvas();

            // Sử dụng ResizeObserver để theo dõi thay đổi kích thước
            const resizeObserver = new ResizeObserver(() => {
                resizeCanvas();
            });

            resizeObserver.observe(container);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, []);

    // Animation loop với Fabric.js
    useEffect(() => {
        if (!fabricCanvasRef.current || bubbles.length === 0) return;

        const canvas = fabricCanvasRef.current;
        let lastTime = 0;
        const frameInterval = 1000 / ANIMATION_CONFIG.TARGET_FPS;

        const animate = (currentTime: number) => {
            if (currentTime - lastTime >= frameInterval) {
                const rect = canvas.getElement().getBoundingClientRect();



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

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [bubbles]); // Bỏ isAnimating dependency để animation luôn chạy

    // Event handlers
    useEffect(() => {
        if (!fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;

        const handleClick = (e: any) => {
            const clickedObj = e.target;

            if (clickedObj && clickedObj.type === 'group') {
                // Lấy thông tin bubble từ custom properties
                const bubbleId = (clickedObj as any).bubbleId;
                const userName = (clickedObj as any).userName;
                const userId = (clickedObj as any).userId;

                if (bubbleId !== undefined) {


                    // TODO: Implement chat opening logic here
                    // Example: openChat(userId, userName);
                }
            }
        };

        canvas.on('mouse:down', handleClick);

        // Thêm hover effect cho các group objects
        // canvas.on('mouse:over', (e) => {
        //     if (e.target && e.target.type === 'group') {
        //         e.target.set({ scaleX: 1.05, scaleY: 1.05 });
        //         canvas.renderAll();
        //     }
        // });

        // canvas.on('mouse:out', (e) => {
        //     if (e.target && e.target.type === 'group') {
        //         e.target.set({ scaleX: 1, scaleY: 1 });
        //         canvas.renderAll();
        //     }
        // });

        return () => {
            canvas.off('mouse:down', handleClick);
            canvas.off('mouse:over');
            canvas.off('mouse:out');
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
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                {/* Background effects */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
                </div>

                <Navigation />

                <main className="relative z-10 pt-4 px-2">
                    {/* Fabric.js Canvas */}
                    <div className="relative w-full h-[calc(100vh-120px)] min-h-[800px] mx-auto max-w-7xl">
                        <canvas
                            onLoad={() => {

                            }}
                            ref={canvasRef}
                            className="w-full h-full block"
                            style={{
                                borderRadius: '20px',
                                boxShadow: '0 0 50px rgba(139, 92, 246, 0.3)',
                                display: 'block',
                            }}
                        />

                        {/* Start/Stop Button - Absolute positioned in top-right corner */}
                        {ANIMATION_CONFIG.ENABLE_LOGGING && (
                            <div className="absolute top-4 right-20 z-20 bg-green-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium">
                                🔍 Debug Logs
                            </div>
                        )}
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

                    {/* Instructions */}
                    <div className="text-center mt-4 text-gray-400 text-xs">
                        <p>{t('instructions')}. {t('bubbleInfo')}</p>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}

