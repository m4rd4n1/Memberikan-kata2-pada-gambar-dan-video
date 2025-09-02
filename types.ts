export type PlacementOption = 'atas' | 'bawah';
export type FrameOption = 'tidak ada' | 'sederhana' | 'elegan' | 'modern' | 'vintage';
export type LogoPlacementOption = 'atas-kiri' | 'atas-kanan' | 'bawah-kiri' | 'bawah-kanan';

export interface QuoteOption {
  id: number;
  teks: string;
}

export interface UploadedFile {
    file: File;
    base64: string;
    mimeType: string;
    previewUrl: string;
}