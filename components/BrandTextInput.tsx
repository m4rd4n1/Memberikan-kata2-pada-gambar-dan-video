import React from 'react';

interface BrandTextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const BrandTextInput: React.FC<BrandTextInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="brand-text" className="block text-sm font-medium text-gray-300">Tulisan Manual</label>
      <p className="text-xs text-gray-400 mb-2">Ketik nama merek atau teks singkat di sini. Akan ditampilkan di posisi yang Anda pilih, bersama dengan logo jika ada.</p>
      <input
        type="text"
        id="brand-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ketik nama brand Anda"
        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition"
        aria-label="Brand text input"
      />
    </div>
  );
};

export default BrandTextInput;