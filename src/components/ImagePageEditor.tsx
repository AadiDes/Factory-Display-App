import React from 'react';
import LogoCropper from './LogoCropper';
import type { ImagePage } from '../App';

interface ImagePageEditorProps {
  page: ImagePage;
  imageCropImage: string | null;
  setImageCropImage: React.Dispatch<React.SetStateAction<string | null>>;
  onSetImageData: (data: string) => void;
  onUpdate: () => void;
  updateButtonText: string;
  setPageDuration: (duration: number) => void;
  setPageSize: (size: 'small' | 'medium' | 'large', aspectRatio: number) => void;
}

const ImagePageEditor: React.FC<ImagePageEditorProps> = ({
  page,
  imageCropImage,
  setImageCropImage,
  onSetImageData,
  onUpdate,
  updateButtonText,
  setPageDuration,
  setPageSize,
}) => (
  <div className="space-y-6 max-w-lg mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Display Duration (seconds)</label>
      <input
        type="number"
        min={1}
        value={page.duration}
        onChange={e => setPageDuration(Number(e.target.value))}
        className="px-3 py-2 border border-gray-300 rounded-lg w-32"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Image for this Page</label>
      {page.imageData && !imageCropImage && (
        <div className="flex flex-col items-start gap-4 mb-2">
          <img
            src={page.imageData}
            alt="Page Image Preview"
            className="h-48 w-auto object-contain rounded border border-gray-300 bg-gray-100 shadow"
          />
          <button
            type="button"
            onClick={() => onSetImageData('')}
            className="text-red-600 hover:text-red-800 text-xs font-medium border border-red-200 rounded px-2 py-1"
          >
            Remove Image
          </button>
        </div>
      )}
      {imageCropImage && (
        <LogoCropper
          image={imageCropImage}
          onComplete={croppedDataUrl => {
            onSetImageData(croppedDataUrl);
            setImageCropImage(null);
          }}
          onCancel={() => setImageCropImage(null)}
          cropShape="rect"
          outputSize={
            page.size === 'large' ? { width: 1920, height: 1080 }
            : page.size === 'medium' ? { width: 1024, height: 1024 }
            : { width: 768, height: 1024 }
          }
          aspectRatio={page.aspectRatio || 1}
        />
      )}
      {!page.imageData && !imageCropImage && (
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImageCropImage(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      )}
      <p className="text-xs text-gray-400 mt-1">Recommended: Rectangular image, will be resized to fit page</p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Image Size</label>
      <select
        value={page.size}
        onChange={e => {
          const val = e.target.value as 'small' | 'medium' | 'large';
          let aspectRatio = 1;
          if (val === 'large') aspectRatio = 16 / 9;
          if (val === 'medium') aspectRatio = 1;
          if (val === 'small') aspectRatio = 3 / 4;
          setPageSize(val, aspectRatio);
        }}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
      >
        <option value="small">Small (3:4 Portrait)</option>
        <option value="medium">Medium (1:1 Square)</option>
        <option value="large">Large (16:9 Landscape)</option>
      </select>
    </div>
  </div>
);

export default ImagePageEditor; 