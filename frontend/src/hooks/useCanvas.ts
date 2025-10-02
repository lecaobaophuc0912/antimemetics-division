import * as fabric from 'fabric';

export const useCanvas = () => {

    const initializeCanvas = (canvasRef: HTMLCanvasElement): {
        fabricCanvasRef: fabric.Canvas | null;
        cleanup: () => void;
    } | null => {
        let fabricCanvasRef: fabric.Canvas | null = null;
        if (!canvasRef) {
            console.warn('Canvas ref not available');
            return null;
        }

        const canvas = canvasRef;
        const container = canvas.parentElement;
        if (!container) {
            console.warn('Canvas container not found');
            return null;
        }

        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            console.warn('Container has no dimensions:', rect);
            return null;
        }

        canvas.width = rect.width;
        canvas.height = rect.height;

        // Dispose canvas cũ nếu có
        if (fabricCanvasRef) {
            (fabricCanvasRef as fabric.Canvas).dispose();
        }

        try {
            const fabricCanvas = new fabric.Canvas(canvas, {
                backgroundColor: 'transparent',
                selection: false,
                interactive: false,
                renderOnAddRemove: false,
            });

            fabricCanvasRef = fabricCanvas;

        } catch (error) {
            console.error('Failed to initialize canvas:', error);
            return null;
        }

        // Set canvas size
        const resizeCanvas = () => {
            if (!canvasRef || !fabricCanvasRef) return;

            const container = canvasRef.parentElement;
            if (container) {
                const rect = container.getBoundingClientRect();
                // Set cả canvas element và Fabric.js canvas
                canvasRef.width = rect.width;
                canvasRef.height = rect.height;
                fabricCanvasRef.setDimensions({
                    width: rect.width,
                    height: rect.height,
                });
                fabricCanvasRef.renderAll();
            }
        };

        // Resize ngay lập tức và sau khi DOM đã render
        setTimeout(resizeCanvas, 0);
        window.addEventListener('resize', resizeCanvas);

        // Cleanup function
        return {
            fabricCanvasRef,
            cleanup: () => {
                window.removeEventListener('resize', resizeCanvas);
                if (fabricCanvasRef) {
                    fabricCanvasRef.dispose();
                    fabricCanvasRef = null;
                }
            },
        };
    }
    return {
        initializeCanvas,
    };
};
