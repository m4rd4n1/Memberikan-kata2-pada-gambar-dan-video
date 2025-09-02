import React from 'react';
import { FrameOption } from '../types';

interface FrameSelectorProps {
  selectedFrame: FrameOption;
  onFrameChange: (frame: FrameOption) => void;
}

const frames: { id: FrameOption; label: string }[] = [
  { id: 'tidak ada', label: 'Tidak Ada' },
  { id: 'sederhana', label: 'Sederhana' },
  { id: 'elegan', label: 'Elegan' },
  { id: 'modern', label: 'Modern' },
  { id: 'vintage', label: 'Vintage' },
];

const FrameSelector: React.FC<FrameSelectorProps> = ({ selectedFrame, onFrameChange }) => {
  return (
    <div>
      <h3 className="block text-sm font-medium text-gray-300">Gaya Bingkai</h3>
      <p className="text-xs text-gray-400 mb-2">Beri sentuhan akhir yang elegan. Bingkai dapat menambah karakter dan fokus pada visual Anda.</p>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {frames.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onFrameChange(id)}
            className={`w-full py-2 px-3 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 ${
              selectedFrame === id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FrameSelector;