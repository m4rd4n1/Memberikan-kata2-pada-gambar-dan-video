import React from 'react';

interface LogoUploaderProps {
  onLogoSelect: (file: File) => void;
  onLogoClear: () => void;
  logoPreviewUrl: string | null;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ onLogoSelect, onLogoClear, logoPreviewUrl }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onLogoSelect(event.target.files[0]);
    }
  };

  if (logoPreviewUrl) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-700 rounded-md p-2">
        <img src={logoPreviewUrl} alt="Logo preview" className="max-h-16 h-auto object-contain" />
        <button
          onClick={onLogoClear}
          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1.5 leading-none"
          aria-label="Remove logo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label
        htmlFor="logo-upload"
        className="flex flex-col items-center justify-center w-full h-full px-4 py-2 transition bg-gray-700 border-2 border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-500 focus:outline-none"
      >
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-medium text-sm text-gray-300">
                Klik untuk <span className="text-purple-400">unggah logo</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">PNG, JPG, SVG</p>
        </div>
        <input id="logo-upload" type="file" name="logo_upload" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/svg+xml" />
      </label>
    </div>
  );
};

export default LogoUploader;