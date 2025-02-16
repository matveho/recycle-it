"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

const MainContent: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showText, setShowText] = useState(false);

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

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                captureImage();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        // Draw video frame onto canvas
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob) return;

            setLoading(true);
            setShowText(true);

            const formData = new FormData();
            formData.append("image", blob, "image.jpg");

            axios
                .post("http://38.40.107.135:8080/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((response) => {
                    console.log("Full Response:", response.data); // Debugging
                    console.log("Objects Detected:", response.data.objects); // Debugging

                    if (response.data && Array.isArray(response.data.objects)) {
                        setDetectedObjects(response.data.objects);
                    } else {
                        console.error("Invalid response format:", response.data);
                        setDetectedObjects(["Error: Invalid response"]);
                    }
                })
                .catch((error) => {
                    console.error("Error uploading image:", error);
                    setDetectedObjects(["Error: Failed to fetch"]);
                })
                .finally(() => {
                    setLoading(false);
                    setTimeout(() => setShowText(false), 2000);
                });
        }, "image/jpeg");
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        const drawGuideBox = () => {
            const width = canvas.width;
            const height = canvas.height;

            context.clearRect(0, 0, width, height);

            const boxSize = Math.min(width, height) * 0.5;
            const x = (width - boxSize) / 2;
            const y = (height - boxSize) / 2;
            const borderRadius = 20;

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

            context.fillStyle = "white";
            context.font = "bold 40px Arial";
            context.textAlign = "center";
            context.fillText("Hold object here", width / 2, y - 20);
        };

        const resizeCanvas = () => {
            if (!canvasRef.current || !videoRef.current) return;
            const video = videoRef.current;
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight;
            drawGuideBox();
        };

        window.addEventListener("resize", resizeCanvas);
        setTimeout(resizeCanvas, 500);

        return () => window.removeEventListener("resize", resizeCanvas);
    }, [showText]);

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

            {showText && (
                <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white text-5xl font-bold bg-black bg-opacity-60 px-8 py-4 rounded-lg transition-opacity duration-1000`}
                    style={{ zIndex: 10 }}
                >
                    {loading ? "Loading..." : detectedObjects.join(", ")}
                </div>
            )}
        </section>
    );
};

export default MainContent;
