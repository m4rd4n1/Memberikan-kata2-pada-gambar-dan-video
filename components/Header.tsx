
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
        Kutipan Visual AI
      </h1>
      <p className="mt-2 text-lg text-gray-300 max-w-2xl mx-auto">
        Unggah foto atau video, dan biarkan AI menciptakan kata-kata motivasi yang menyentuh jiwa dari gambar Anda.
      </p>
    </header>
  );
};

export default Header;
