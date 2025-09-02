import React, { useState } from 'react';
import { QuoteOption } from '../types';

interface QuoteCardProps {
  quote: QuoteOption;
  onCreateVisual: () => void;
  isCreating: boolean;
  isMediaVideo: boolean;
  onSelect: () => void;
  isActive: boolean;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onCreateVisual, isCreating, isMediaVideo, onSelect, isActive }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent onSelect from firing when copy is clicked
    navigator.clipboard.writeText(quote.teks);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateVisualClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent onSelect from firing
    onCreateVisual();
  };


  return (
    <div
      onClick={onSelect}
      className={`bg-gray-800/50 backdrop-blur-md p-6 rounded-lg shadow-lg relative border cursor-pointer transition-all duration-300 ${isActive ? 'border-purple-500 scale-[1.02]' : 'border-gray-700 hover:border-purple-400'}`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onSelect()}
    >
      <p className="text-lg italic text-gray-200 pr-24">"{quote.teks}"</p>
      <div className="absolute top-3 right-3 flex items-center space-x-2">
        <button
          onClick={handleCreateVisualClick}
          disabled={isCreating || isMediaVideo}
          className="p-1.5 rounded-full bg-gray-700 hover:bg-purple-600 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Create visual with quote"
          title={isMediaVideo ? "Fitur ini hanya untuk gambar" : "Buat Gambar dengan Kutipan"}
        >
          {isCreating ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-full bg-gray-700 hover:bg-purple-600 text-gray-300 hover:text-white transition-colors"
          aria-label="Copy quote"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuoteCard;