"use client";

import { useEffect, useRef } from "react";

const MainContent: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user", width: 1280, height: 720 },
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        };

        startCamera();
    }, []);

    // Draw guide box on canvas
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        const drawGuideBox = () => {
            const width = canvas.width;
            const height = canvas.height;

            // Clear previous drawings
            context.clearRect(0, 0, width, height);

            // Define center square dimensions
            const boxSize = Math.min(width, height) * 0.5; // 50% of the smaller dimension
            const x = (width - boxSize) / 2;
            const y = (height - boxSize) / 2;
            const borderRadius = 20; // Rounded corners

            // Draw rounded rectangle
            context.lineWidth = 6;
            context.strokeStyle = "red";
            context.beginPath();
            context.moveTo(x + borderRadius, y);
            context.lineTo(x + boxSize - borderRadius, y);
            context.quadraticCurveTo(x + boxSize, y, x + boxSize, y + borderRadius);
            context.lineTo(x + boxSize, y + boxSize - borderRadius);
            context.quadraticCurveTo(x + boxSize, y + boxSize, x + boxSize - borderRadius, y + boxSize);
            context.lineTo(x + borderRadius, y + boxSize);
            context.quadraticCurveTo(x, y + boxSize, x, y + boxSize - borderRadius);
            context.lineTo(x, y + borderRadius);
            context.quadraticCurveTo(x, y, x + borderRadius, y);
            context.stroke();

            // Draw instruction text
            context.fillStyle = "white";
            context.font = "bold 40px Arial";
            context.textAlign = "center";
            context.fillText("Hold object here", width / 2, y - 20);
        };

        // Set canvas size
        const resizeCanvas = () => {
            if (!canvasRef.current || !videoRef.current) return;
            const video = videoRef.current;
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight;
            drawGuideBox();
        };

        // Resize canvas when video resizes
        window.addEventListener("resize", resizeCanvas);
        setTimeout(resizeCanvas, 500); // Ensure video has loaded before drawing

        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    return (
        <section className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover transform scale-[1.1]"
            />

            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none"></canvas>
        </section>
    );
};

export default MainContent;
