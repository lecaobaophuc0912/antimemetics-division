import * as fabric from 'fabric';

export interface User {
    id: number;
    name: string;
    avatarUrl: string | null;
    color: string;
}

export interface Bubble {
    id: number;
    fabricObject: fabric.Group;
    speedX: number;
    speedY: number;
    rotationSpeed: number;
    shimmer: number;
    avatarUrl: string | null;
    userName: string;
    userId: number;
    color: string;
    isArranging?: boolean;
    isLocked?: boolean;
    prevSpeedX?: number;
    prevSpeedY?: number;
    isMarkedDone?: boolean;
}

export const useFabricObjects = () => {
    const mockUsers: User[] = [
        { id: 1, name: 'Alice Johnson', avatarUrl: '/avatars/1.jpg', color: '#FF6B6B' },
        { id: 2, name: 'Bob Smith', avatarUrl: '/avatars/2.jpg', color: '#4ECDC4' },
        { id: 3, name: 'Carol Davis', avatarUrl: '/avatars/3.jpg', color: '#45B7D1' },
        { id: 4, name: 'David Wilson', avatarUrl: '/avatars/4.jpg', color: '#96CEB4' },
        { id: 5, name: 'Eva Brown', avatarUrl: '/avatars/5.jpg', color: '#FFEAA7' },
        { id: 6, name: 'Frank Miller', avatarUrl: '/avatars/6.jpg', color: '#DDA0DD' },
        { id: 7, name: 'Grace Lee', avatarUrl: '/avatars/7.jpg', color: '#98D8C8' },
        { id: 8, name: 'Henry Taylor', avatarUrl: '/avatars/8.jpg', color: '#F7DC6F' },
        { id: 9, name: 'Ivy Chen', avatarUrl: '/avatars/9.jpg', color: '#BB8FCE' },
        { id: 10, name: 'Jack Anderson', avatarUrl: '/avatars/10.jpg', color: '#85C1E9' },
        { id: 11, name: 'Kate White', avatarUrl: '/avatars/1.jpg', color: '#F8C471' },
        { id: 12, name: 'Liam Garcia', avatarUrl: '/avatars/2.jpg', color: '#82E0AA' },
        { id: 13, name: 'Mia Rodriguez', avatarUrl: '/avatars/3.jpg', color: '#F1948A' },
        { id: 14, name: 'Noah Martinez', avatarUrl: '/avatars/4.jpg', color: '#85C1E9' },
        { id: 15, name: 'Olivia Thompson', avatarUrl: '/avatars/5.jpg', color: '#D7BDE2' },
        { id: 16, name: 'Paul Lewis', avatarUrl: '/avatars/6.jpg', color: '#A9DFBF' },
        { id: 17, name: 'Quinn Hall', avatarUrl: '/avatars/7.jpg', color: '#F9E79F' },
        { id: 18, name: 'Ruby Clark', avatarUrl: '/avatars/8.jpg', color: '#D5A6BD' },
        { id: 19, name: 'Sam Young', avatarUrl: '/avatars/9.jpg', color: '#AED6F1' },
        { id: 20, name: 'Tina Adams', avatarUrl: '/avatars/10.jpg', color: '#FAD7A0' },
    ];

    const createInitialBubbles = async (): Promise<Bubble[]> => {
        const initialBubbles: Bubble[] = [];
        const size = 120;
        const strokeWidth = 3;

        for (let index = 0; index < mockUsers.length; index++) {
            const mockUser = mockUsers[index];
            const elements: fabric.Object[] = [];

            if (mockUser.avatarUrl) {
                try {
                    // Use fabric.util.loadImage and FabricImage
                    const img = await fabric.util.loadImage(mockUser.avatarUrl, { crossOrigin: 'use-credentials' });
                    const fabricImg = new fabric.FabricImage(img, {
                        left: 0,
                        top: 0,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });
                    const scale = size / Math.max(img.width || 1, img.height || 1);
                    fabricImg.set({ scaleX: scale, scaleY: scale });

                    // Tạo stroke circle
                    const strokeCircle = new fabric.Circle({
                        left: 0,
                        top: 0,
                        radius: size / 2,
                        fill: 'transparent',
                        stroke: mockUser.color,
                        strokeWidth,
                        selectable: false,
                        evented: false,
                        originX: 'center',
                        originY: 'center',
                    });

                    // Tạo shimmer effect
                    const shimmer = new fabric.Circle({
                        left: 0,
                        top: 0,
                        radius: size / 2,
                        fill: new fabric.Gradient({
                            type: 'radial',
                            coords: { r1: size / 2, x1: 0, y1: 0, r2: 0, x2: 0, y2: 0 },
                            colorStops: [
                                { offset: 0, color: 'rgba(255, 255, 255, 0.3)' },
                                { offset: 0.7, color: 'rgba(255, 255, 255, 0.1)' },
                                { offset: 1, color: 'transparent' },
                            ],
                        }),
                        selectable: false,
                        evented: false,
                        originX: 'center',
                        originY: 'center',
                    });

                    // Tạo name label
                    const nameLabel = new fabric.Text(mockUser.name, {
                        left: 0,
                        top: size / 2 + 10,
                        fontSize: 12,
                        fill: '#333',
                        fontFamily: 'Orbitron, monospace',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        selectable: false,
                        evented: false,
                        originX: 'center',
                        originY: 'top',
                        paintFirst: 'fill',
                        stroke: '#fff',
                        strokeWidth: 2,
                        shadow: new fabric.Shadow({
                            color: 'rgba(0, 0, 0, 0.3)',
                            blur: 2,
                            offsetX: 1,
                            offsetY: 1,
                        }),
                    });

                    // Tạo badge
                    const badge = new fabric.Circle({
                        left: size / 2 - 15,
                        top: -size / 2 + 15,
                        radius: 15,
                        fill: '#ff4757',
                        selectable: false,
                        evented: false,
                        originX: 'center',
                        originY: 'center',
                    });

                    // Tạo badge text
                    const badgeText = new fabric.Text('3', {
                        left: size / 2 - 15,
                        top: -size / 2 + 15,
                        fontSize: 10,
                        fill: '#fff',
                        fontFamily: 'Orbitron, monospace',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        selectable: false,
                        evented: false,
                        originX: 'center',
                        originY: 'center',
                        paintFirst: 'fill',
                        stroke: '#ff4757',
                        strokeWidth: 1,
                    });

                    elements.push(fabricImg, strokeCircle, shimmer, nameLabel, badge, badgeText);
                } catch (error) {
                    console.error('Failed to load image:', error);
                    // Fallback to circle if image fails to load
                    const fallbackCircle = new fabric.Circle({
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
                    });
                    elements.push(fallbackCircle);
                }
            } else {
                // Tạo circle cho user không có avatar
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
                });

                // Tạo shimmer effect
                const shimmer = new fabric.Circle({
                    left: 0,
                    top: 0,
                    radius: size / 2,
                    fill: new fabric.Gradient({
                        type: 'radial',
                        coords: { r1: size / 2, x1: 0, y1: 0, r2: 0, x2: 0, y2: 0 },
                        colorStops: [
                            { offset: 0, color: 'rgba(255, 255, 255, 0.3)' },
                            { offset: 0.7, color: 'rgba(255, 255, 255, 0.1)' },
                            { offset: 1, color: 'transparent' },
                        ],
                    }),
                    selectable: false,
                    evented: false,
                    originX: 'center',
                    originY: 'center',
                });

                // Tạo fallback text (2 chữ cái đầu)
                const nameParts = mockUser.name.split(' ');
                let fallbackText = '';
                if (nameParts.length >= 2) {
                    fallbackText = nameParts[0].charAt(0) + nameParts[1].charAt(0);
                } else {
                    fallbackText = mockUser.name.substring(0, 2);
                }

                const fallbackTextObj = new fabric.Text(fallbackText, {
                    left: 0,
                    top: 0,
                    fontSize: 24,
                    fill: mockUser.color,
                    fontFamily: 'Orbitron, monospace',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    selectable: false,
                    evented: false,
                    originX: 'center',
                    originY: 'center',
                    paintFirst: 'fill',
                    stroke: '#fff',
                    strokeWidth: 3,
                    shadow: new fabric.Shadow({
                        color: 'rgba(0, 0, 0, 0.3)',
                        blur: 2,
                        offsetX: 1,
                        offsetY: 1,
                    }),
                });

                // Tạo name label
                const nameLabel = new fabric.Text(mockUser.name, {
                    left: 0,
                    top: size / 2 + 10,
                    fontSize: 12,
                    fill: '#333',
                    fontFamily: 'Orbitron, monospace',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    selectable: false,
                    evented: false,
                    originX: 'center',
                    originY: 'top',
                    paintFirst: 'fill',
                    stroke: '#fff',
                    strokeWidth: 2,
                    shadow: new fabric.Shadow({
                        color: 'rgba(0, 0, 0, 0.3)',
                        blur: 2,
                        offsetX: 1,
                        offsetY: 1,
                    }),
                });

                elements.push(circle, shimmer, fallbackTextObj, nameLabel);
            }

            // Random position in canvas (moved declaration here)
            const x = Math.random() * (800 - size) + size / 2;
            const y = Math.random() * (600 - size) + size / 2;

            const group = new fabric.Group(elements, {
                left: x,
                top: y,
                selectable: false,
                evented: true,
                originX: 'center',
                originY: 'center',
                objectCaching: true,
                hoverCursor: 'pointer',
            });

            // Set custom properties
            (group as any).bubbleId = index;
            (group as any).userName = mockUser.name;
            (group as any).userId = mockUser.id;

            // Add event listeners
            (group as any).on('mouse:down', () => {
                console.log('Clicked on avatar:', mockUser.name);
            });

            initialBubbles.push({
                id: index,
                fabricObject: group,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                rotationSpeed: 0, // Disabled rotation
                shimmer: Math.random() * 100,
                avatarUrl: mockUser.avatarUrl,
                userName: mockUser.name,
                userId: mockUser.id,
                color: mockUser.color,
            });
        }

        return initialBubbles;
    };

    return { mockUsers, createInitialBubbles };
};
