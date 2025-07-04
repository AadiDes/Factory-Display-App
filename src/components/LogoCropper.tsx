import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';

interface LogoCropperProps {
  image: string;
  onComplete: (croppedDataUrl: string) => void;
  onCancel: () => void;
  aspect?: number;
  cropShape?: 'round' | 'rect';
  outputSize?: { width: number; height: number };
  aspectRatio?: number;
}

function getCroppedImg(imageSrc: string, crop: { x: number, y: number, width: number, height: number }, zoom: number, aspect: number, cropShape: 'round' | 'rect', outputSize: { width: number; height: number }): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = outputSize.width;
      canvas.height = outputSize.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No canvas context');
      ctx.save();
      if (cropShape === 'round') {
        const r = Math.min(canvas.width, canvas.height) / 2;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
      }
      ctx.drawImage(
        image,
        crop.x, crop.y, crop.width, crop.height,
        0, 0, canvas.width, canvas.height
      );
      ctx.restore();
      canvas.toBlob(async (blob) => {
        if (!blob) return reject('No blob');
        const compressed = await imageCompression(blob as File, { maxWidthOrHeight: Math.max(canvas.width, canvas.height), maxSizeMB: 0.8, useWebWorker: true });
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(compressed);
      }, 'image/png');
    };
    image.onerror = reject;
  });
}

const LogoCropper: React.FC<LogoCropperProps> = ({ image, onComplete, onCancel, aspect = 1, cropShape = 'round', outputSize = { width: 1024, height: 1024 }, aspectRatio = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    setLoading(true);
    try {
      const croppedImg = await getCroppedImg(image, croppedAreaPixels, zoom, aspectRatio, cropShape, outputSize);
      onComplete(croppedImg);
    } catch (e) {
      alert('Failed to crop image');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90vw] max-w-md relative">
        <h2 className="text-lg font-semibold mb-4">Crop Logo</h2>
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="flex-1"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoCropper; 