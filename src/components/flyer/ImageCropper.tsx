import React, { useState, useCallback } from "react";
import ReactEasyCrop, { Area } from "react-easy-crop";

const OUTPUT_SIZE = 1024;

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const updateCropAxis = (axis: "x" | "y", value: number) => {
    setCrop((currentCrop) => ({
      ...currentCrop,
      [axis]: value,
    }));
  };

  const onCropCompleteHandler = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSaveCrop = async () => {
    if (!croppedAreaPixels) return;

    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE
      );

      const croppedImage = canvas.toDataURL("image/png");
      onCropComplete(croppedImage);
    };
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative w-full h-80 bg-dark-blue-800 rounded-lg overflow-hidden">
        <ReactEasyCrop
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          restrictPosition={false}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-uncutsans text-gray-300">
            Move Left / Right
          </label>
          <input
            type="range"
            min={-150}
            max={150}
            step={1}
            value={crop.x}
            onChange={(e) => updateCropAxis("x", Number(e.target.value))}
            className="w-full h-2 bg-dark-blue-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-uncutsans text-gray-300">
            Move Up / Down
          </label>
          <input
            type="range"
            min={-150}
            max={150}
            step={1}
            value={crop.y}
            onChange={(e) => updateCropAxis("y", Number(e.target.value))}
            className="w-full h-2 bg-dark-blue-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <label className="block text-sm font-uncutsans text-gray-300">
          Zoom
        </label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full h-2 bg-dark-blue-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <button
        onClick={handleSaveCrop}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-uncutsans py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Apply Crop
      </button>
    </div>
  );
};
