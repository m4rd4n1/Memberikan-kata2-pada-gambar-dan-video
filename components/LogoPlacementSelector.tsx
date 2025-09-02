import React from 'react';
import { LogoPlacementOption } from '../types';

interface LogoPlacementSelectorProps {
  selectedPlacement: LogoPlacementOption;
  onPlacementChange: (placement: LogoPlacementOption) => void;
}

const placements: { id: LogoPlacementOption; label: string }[] = [
  { id: 'atas-kiri', label: 'Atas Kiri' },
  { id: 'atas-kanan', label: 'Atas Kanan' },
  { id: 'bawah-kiri', label: 'Bawah Kiri' },
  { id: 'bawah-kanan', label: 'Bawah Kanan' },
];

const LogoPlacementSelector: React.FC<LogoPlacementSelectorProps> = ({ selectedPlacement, onPlacementChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300">Posisi Branding</label>
      <p className="text-xs text-gray-400 mb-2">Tentukan di mana logo dan nama merek Anda akan ditampilkan. Konsistensi posisi membangun identitas visual.</p>
      <div className="grid grid-cols-2 gap-2">
        {placements.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onPlacementChange(id)}
            className={`w-full py-2 px-3 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 h-full ${
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

export default LogoPlacementSelector;