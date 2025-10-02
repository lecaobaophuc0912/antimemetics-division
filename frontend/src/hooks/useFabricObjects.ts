import * as fabric from 'fabric';

// Mock data cho các user có thể chat - 20 users với avatar tái sử dụng

interface User {
    id: string;
    name: string;
    avatarUrl?: string | null;
    color: string;
}

export const mockUsers: User[] = [
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
];

export const useFabricObjects = () => {

    const createInitialBubbles = async (fabricCanvasRef: fabric.Canvas, users: User[]) => {
        if (!fabricCanvasRef) return [];

        const canvas = fabricCanvasRef;
        const rect = canvas.getElement().getBoundingClientRect();
        const initialBubbles = [];
        let index = 0;
        for (const mockUser of users) {
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
            fabricCanvasRef.renderAll();

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
    };

    return {
        createInitialBubbles,
    };
};