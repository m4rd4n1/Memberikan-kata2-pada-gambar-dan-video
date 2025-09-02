import React from 'react';
import { PlacementOption } from '../types';

interface PlacementSelectorProps {
  selectedPlacement: PlacementOption;
  onPlacementChange: (placement: PlacementOption) => void;
}

const placements: { id: PlacementOption; label: string }[] = [
  { id: 'atas', label: 'Atas' },
  { id: 'bawah', label: 'Bawah' },
];

const PlacementSelector: React.FC<PlacementSelectorProps> = ({ selectedPlacement, onPlacementChange }) => {
  return (
    <div>
      <h3 className="block text-sm font-medium text-gray-300">Posisi Teks</h3>
      <p className="text-xs text-gray-400 mb-2">Atur letak kutipan pada visual Anda. Penempatan yang tepat dapat memperkuat pesan dan estetika gambar.</p>
      <div className="grid grid-cols-2 gap-2">
        {placements.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onPlacementChange(id)}
            className={`w-full py-2 px-3 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 ${
              selectedPlacement === id
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

export default PlacementSelector;