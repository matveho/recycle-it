"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

const ENABLE_CROPPING = false;

const wasteDisposalMap: Record<string, string> = {
    "Aluminium foil": "Recycle - Clean it before disposing.",
    "Battery": "Hazardous Waste - Take it to a battery disposal center.",
    "Aluminium blister pack": "Garbage - Not recyclable.",
    "Carded blister pack": "Garbage - Dispose in regular trash.",
    "Other plastic bottle": "Recycle - Empty and rinse before recycling.",
    "Clear plastic bottle": "Recycle - Remove cap and rinse.",
    "Glass bottle": "Recycle - Place in glass recycling bin.",
    "Plastic bottle cap": "Recycle - Place in plastics recycling.",
    "Metal bottle cap": "Recycle - Place in metal recycling bin.",
    "Broken glass": "Garbage - Wrap in newspaper before disposal.",
    "Food Can": "Recycle - Rinse before recycling.",
    "Aerosol": "Recycle - Throw it in the blue bin..",
    "Drink can": "Recycle - Rinse and place in metal recycling.",
    "Toilet tube": "Recycle - Place in paper recycling bin.",
    "Other carton": "Recycle - Flatten before recycling.",
    "Egg carton": "Recycle - Place in paper recycling bin.",
    "Drink carton": "Recycle - Empty and rinse before recycling.",
    "Corrugated carton": "Recycle - Flatten and place in recycling bin.",
    "Meal carton": "Recycle - Rinse and dispose properly.",
    "Pizza box": "Compost - If clean, recycle. If greasy, compost.",
    "Paper cup": "Garbage - Not recyclable.",
    "Disposable plastic cup": "Garbage - Not recyclable.",
    "Foam cup": "Garbage - Styrofoam is not recyclable.",
    "Glass cup": "Garbage - Broken glass must be wrapped before disposal.",
    "Other plastic cup": "Garbage - Dispose in regular trash.",
    "Food waste": "Compost - Dispose in organic waste bin.",
    "Glass jar": "Recycle - Remove lid and rinse before recycling.",
    "Plastic lid": "Recycle - Place in plastics recycling.",
    "Metal lid": "Recycle - Place in metal recycling.",
    "Other plastic": "Garbage - Dispose in trash bin.",
    "Magazine paper": "Recycle - Place in paper recycling.",
    "Tissues": "Garbage - Not recyclable.",
    "Wrapping paper": "Recycle - Only if not foil or plastic-coated.",
    "Normal paper": "Recycle - Place in paper recycling.",
    "Paper bag": "Recycle - Flatten and place in paper recycling.",
    "Plastified paper bag": "Garbage - Not recyclable.",
    "Plastic film": "Garbage - Not recyclable.",
    "Six pack rings": "Garbage - Cut before disposal.",
    "Garbage bag": "Garbage - Not recyclable.",
    "Other plastic wrapper": "Garbage - Dispose in trash bin.",
    "Single-use carrier bag": "Recycle - Take to plastic bag recycling center.",
    "Polypropylene bag": "Garbage - Not recyclable.",
    "Crisp packet": "Garbage - Not recyclable.",
    "Spread tub": "Recycle - Rinse and place in plastic recycling.",
    "Tupperware": "Recycle - If marked recyclable, otherwise garbage.",
    "Disposable food container": "Garbage - Not recyclable.",
    "Foam food container": "Garbage - Styrofoam is not recyclable.",
    "Other plastic container": "Recycle - Rinse and check recycling number.",
    "Plastic gloves": "Garbage - Dispose in trash bin.",
    "Plastic utensils": "Garbage - Not recyclable.",
    "Pop tab": "Recycle - Place in metal recycling bin.",
    "Rope & strings": "Garbage - Not recyclable.",
    "Scrap metal": "Recycle - Take to a scrap metal facility.",
    "Shoe": "Donate - If in good condition. Otherwise, garbage.",
    "Squeezable tube": "Garbage - Not recyclable.",
    "Plastic straw": "Garbage - Not recyclable.",
    "Paper straw": "Compost - Place in organic waste bin.",
    "Styrofoam piece": "Garbage - Not recyclable.",
    "Unlabeled litter": "Garbage - Dispose in trash bin.",
    "Cigarette": "Garbage - Dispose properly to prevent pollution."
};

const MainContent: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
    const [instruction, setInstruction] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [showGuideBox, setShowGuideBox] = useState(false);

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
            if (event.code === "Space" && !loading && !showCountdown) {
                startCountdown();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [loading, showCountdown]);

    const startCountdown = () => {
        setShowGuideBox(true);
        setShowCountdown(true);
        setCountdown(3);

        let counter = 3;
        const interval = setInterval(() => {
            counter--;
            setCountdown(counter);
            if (counter === 0) {
                clearInterval(interval);
                setShowCountdown(false);
                captureImage();
            }
        }, 500);
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        // Draw video frame onto canvas
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        let croppedCanvas = canvas;
        if (ENABLE_CROPPING) {
            croppedCanvas = document.createElement("canvas");
            const boxSize = Math.min(canvas.width, canvas.height) * 0.5;
            const x = (canvas.width - boxSize) / 2;
            const y = (canvas.height - boxSize) / 2;

            croppedCanvas.width = boxSize;
            croppedCanvas.height = boxSize;
            const croppedContext = croppedCanvas.getContext("2d");

            if (croppedContext) {
                croppedContext.drawImage(
                    canvas,
                    x, y, boxSize, boxSize, // Source (cropped area)
                    0, 0, boxSize, boxSize  // Destination (new canvas)
                );
            }
        }

        croppedCanvas.toBlob((blob) => {
            if (!blob) return;

            setLoading(true);
            setShowGuideBox(false);
            setInstruction(null);
            setDetectedObjects([]);

            const formData = new FormData();
            formData.append("image", blob, "image.jpg");

            axios
                .post("https://api.uara.ca:8080/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((response) => {
                    console.log("Full Response:", response.data);

                    if (response.data.objects && Array.isArray(response.data.objects)) {
                        setDetectedObjects(response.data.objects);
                        generateInstruction(response.data.objects);
                    }
                })
                .catch((error) => {
                    console.error("Error uploading image:", error);
                    setInstruction("Error: Failed to fetch");
                })
                .finally(() => {
                    setLoading(false);
                });
        }, "image/jpeg");
    };

    const generateInstruction = (objects: string[]) => {
        if (objects.length === 0) {
            setInstruction("No recognizable object detected.");
            return;
        }

        const mainObject = objects[0]; // Highest confidence object
        const disposalInstruction = wasteDisposalMap[mainObject] || "Unknown item - Please check local guidelines.";
        setInstruction(disposalInstruction);
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        const drawGuideBox = () => {
            if (!canvasRef.current) return;
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            if (!context) return;

            const width = canvas.width;
            const height = canvas.height;
            const boxSize = Math.min(width, height) * 0.5;
            const x = (width - boxSize) / 2;
            const y = (height - boxSize) / 2;
            const cornerRadius = boxSize * 0.1; // Rounded corners (10% of box size)

            // Clear canvas before drawing
            context.clearRect(0, 0, width, height);

            // Draw a smooth, clean, rounded square
            context.lineWidth = 4;
            context.strokeStyle = "rgba(255, 50, 50, 0.9)"; // Softer red
            context.beginPath();
            context.moveTo(x + cornerRadius, y);
            context.lineTo(x + boxSize - cornerRadius, y);
            context.quadraticCurveTo(x + boxSize, y, x + boxSize, y + cornerRadius);
            context.lineTo(x + boxSize, y + boxSize - cornerRadius);
            context.quadraticCurveTo(x + boxSize, y + boxSize, x + boxSize - cornerRadius, y + boxSize);
            context.lineTo(x + cornerRadius, y + boxSize);
            context.quadraticCurveTo(x, y + boxSize, x, y + boxSize - cornerRadius);
            context.lineTo(x, y + cornerRadius);
            context.quadraticCurveTo(x, y, x + cornerRadius, y);
            context.stroke();

            // Optional: Add subtle shadow for better visibility
            context.shadowColor = "rgba(255, 50, 50, 0.5)";
            context.shadowBlur = 10;
            context.stroke();

            // Optional: Add a soft instruction text inside the box
            context.shadowBlur = 0; // Remove shadow for text
            context.fillStyle = "rgba(255, 255, 255, 0.8)";
            context.font = `bold ${Math.floor(boxSize * 0.1)}px Arial`;
            context.textAlign = "center";
            context.fillText("Place object here", width / 2, y - 15);
        };

        if (showGuideBox) {
            drawGuideBox();
        } else {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [showGuideBox]);

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

            {showCountdown && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl font-bold bg-black bg-opacity-60 px-6 py-4 rounded-lg">
                    {countdown}
                </div>
            )}

            {loading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-5xl font-bold bg-black bg-opacity-60 px-8 py-4 rounded-lg animate-pulse">
                    Loading...
                </div>
            )}

            {!loading && instruction && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold bg-black bg-opacity-70 px-8 py-4 rounded-lg">
                    {instruction}
                </div>
            )}

            {detectedObjects.length > 0 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                    Detected: {detectedObjects.join(", ")}
                </div>
            )}
        </section>
    );
};

export default MainContent;