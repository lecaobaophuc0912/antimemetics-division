import * as fabric from 'fabric';

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    const fabricCanvasRef = { current: null as fabric.Canvas | null };

    // Khởi tạo canvas khi canvasRef.current có sẵn
    const initializeCanvas = (canvasRefInput: React.RefObject<HTMLCanvasElement | null>) => {
        if (!canvasRefInput.current) return;

        const canvas = canvasRefInput.current;
        const container = canvas.parentElement;
        if (!container) return;

        // Đảm bảo container đã có kích thước
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            // Nếu container chưa có kích thước, đợi một chút
            setTimeout(() => {
                if (canvasRefInput.current && canvasRefInput.current.parentElement) {
                    const newRect = canvasRefInput.current.parentElement.getBoundingClientRect();
                    if (newRect.width > 0 && newRect.height > 0) {
                        createFabricCanvas();
                    }
                }
            }, 100);
            return;
        }


        function createFabricCanvas() {
            if (!canvasRef.current) {
                return;
            }

            const canvas = canvasRef.current;
            const container = canvas.parentElement;
            if (!container) {
                return;
            }

            const rect = container.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
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
    };

    // Đảm bảo canvas được resize đúng cách
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

    // Cleanup function
    const cleanup = () => {
        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.dispose();
            fabricCanvasRef.current = null;
        }
    };

    return {
        fabricCanvasRef,
        initializeCanvas,
        resizeCanvas,
        cleanup,
    };
};
