'use client'
import { useRef, useEffect, useState } from 'react';
import { loadOpencv } from '../utils/opencv';

const EyeCorrection = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [opencv, setOpencv] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeOpencv = async () => {
            try {
                const opencv = await loadOpencv();
                setOpencv(opencv);
            } catch (error) {
                console.error('Error loading OpenCV:', error);
            }
        };

        initializeOpencv();

        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            } catch (err) {
                setError('Error accessing webcam: ' + err.message);
            }
        };

        startVideo();

        const processFrame = () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && opencv) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const src = opencv.matFromImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
                const dst = new opencv.Mat();

                // Example image processing
                opencv.cvtColor(src, src, opencv.COLOR_RGBA2GRAY);
                opencv.equalizeHist(src, dst);

                ctx.putImageData(new ImageData(new Uint8ClampedArray(dst.data), canvas.width, canvas.height), 0, 0);

                src.delete();
                dst.delete();
            }

            requestAnimationFrame(processFrame);
        };

        processFrame();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();

                tracks.forEach((track) => track.stop());
                videoRef.current.srcObject = null;
            }
        };
    }, [opencv]);

    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <video ref={videoRef} style={{ display: 'none' }} />
            <canvas ref={canvasRef} />
        </div>
    );
};

export default EyeCorrection;
