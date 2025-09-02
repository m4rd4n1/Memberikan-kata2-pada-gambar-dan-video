import React from 'react';
import { UploadedFile, PlacementOption, FrameOption, LogoPlacementOption } from '../types';

interface MediaPreviewProps {
  file: UploadedFile;
  quoteText?: string | null;
  placement: PlacementOption;
  frame: FrameOption;
  onClear: () => void;
  logoFile: UploadedFile | null;
  logoPlacement: LogoPlacementOption;
  brandText?: string;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ file, quoteText, placement, frame, onClear, logoFile, logoPlacement, brandText }) => {
  const placementClasses: { [key in PlacementOption]: string } = {
    atas: 'top-4 left-4 right-4 text-center',
    bawah: 'bottom-4 left-4 right-4 text-center',
  };

  const frameClasses: { [key in FrameOption]: string } = {
    'tidak ada': 'bg-gray-900/50',
    sederhana: 'p-1 bg-black',
    elegan: 'p-2 bg-slate-200 shadow-lg',
    modern: 'p-3 bg-white shadow-md',
    vintage: 'p-2 bg-yellow-900 border-4 border-yellow-800',
  };

  const logoPlacementClasses: { [key in LogoPlacementOption]: string } = {
    'atas-kiri': 'top-3 left-3',
    'atas-kanan': 'top-3 right-3',
    'bawah-kiri': 'bottom-3 left-3',
    'bawah-kanan': 'bottom-3 right-3',
  };

  const textContainerClasses = `absolute p-2 bg-black/60 backdrop-blur-sm rounded-md transition-all duration-300 pointer-events-none z-10 ${placementClasses[placement]}`;
  const textClasses = "text-white text-base md:text-lg font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]";

  return (
    <div className={`group relative w-full max-h-[22rem] flex items-center justify-center rounded-lg transition-all duration-300 ${frameClasses[frame]}`}>
      {file.mimeType.startsWith('video/') ? (
        <video src={file.previewUrl} controls autoPlay loop muted className="w-full h-auto max-h-80 object-contain rounded-lg shadow-md" />
      ) : (
        <img src={file.previewUrl} alt="Preview" className="w-full h-auto max-h-80 object-contain rounded-lg shadow-md" />
      )}
      <button 
        onClick={onClear}
        className="absolute top-2 right-2 z-30 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Remove media"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {quoteText && (
        <div className={`${textContainerClasses} ${quoteText ? 'opacity-100' : 'opacity-0'}`}>
          <p className={textClasses}>"{quoteText}"</p>
        </div>
      )}

      {(logoFile || brandText) && (
        <div className={`absolute flex items-center gap-2 z-20 pointer-events-none p-1.5 bg-black/30 rounded-md ${logoPlacementClasses[logoPlacement]}`}>
          {logoFile && (
            <img 
                src={logoFile.previewUrl} 
                alt="Logo preview" 
                className="h-10 w-auto"
            />
          )}
          {brandText && (
            <p className="text-white text-xs md:text-sm font-sans whitespace-nowrap drop-shadow-lg">{brandText}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaPreview;