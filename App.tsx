import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import QuoteCard from './components/QuoteCard';
import Loader from './components/Loader';
import PlacementSelector from './components/PlacementSelector';
import MediaPreview from './components/MediaPreview';
import FrameSelector from './components/FrameSelector';
import LogoUploader from './components/LogoUploader';
import LogoPlacementSelector from './components/LogoPlacementSelector';
import BrandTextInput from './components/BrandTextInput';
import { analyzeImage, generateQuotes, createVisualWithQuote } from './services/geminiService';
import { QuoteOption, UploadedFile, PlacementOption, FrameOption, LogoPlacementOption } from './types';

const fileToData = (file: File): Promise<{ base64: string; previewUrl: string, mimeType: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, previewUrl: result, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });


const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [theme, setTheme] = useState('');
  const [instructions, setInstructions] = useState('');
  const [quotes, setQuotes] = useState<QuoteOption[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [isCreatingVisual, setIsCreatingVisual] = useState<number | null>(null);
  const [generatedVisual, setGeneratedVisual] = useState<string | null>(null);
  const [errorVisual, setErrorVisual] = useState<string | null>(null);
  const [placement, setPlacement] = useState<PlacementOption>('bawah');
  const [frame, setFrame] = useState<FrameOption>('tidak ada');
  const [activeQuote, setActiveQuote] = useState<QuoteOption | null>(null);
  
  const [logoFile, setLogoFile] = useState<UploadedFile | null>(null);
  const [logoPlacement, setLogoPlacement] = useState<LogoPlacementOption>('bawah-kanan');
  const [brandText, setBrandText] = useState('');


  const handleClearMedia = () => {
    setUploadedFile(null);
    setQuotes(null);
    setGeneratedVisual(null);
    setActiveQuote(null);
    setError(null);
    setErrorVisual(null);
    setFrame('tidak ada');
    setLogoFile(null);
    setBrandText('');
  };
  
  const handleClearLogo = () => {
    setLogoFile(null);
  };

  const handleFileSelect = useCallback(async (file: File) => {
    handleClearMedia();
    try {
      const { base64, previewUrl, mimeType } = await fileToData(file);
      setUploadedFile({ file, base64, previewUrl, mimeType });
    } catch (err) {
      setError("Gagal memproses file. Silakan coba file lain.");
      console.error(err);
    }
  }, []);

  const handleLogoSelect = useCallback(async (file: File) => {
    try {
        const { base64, previewUrl, mimeType } = await fileToData(file);
        setLogoFile({ file, base64, previewUrl, mimeType });
      } catch (err) {
        setError("Gagal memproses file logo. Silakan coba file lain.");
        console.error(err);
      }
  }, []);
  
  const handleGenerate = async () => {
    if (!uploadedFile) {
      setError('Silakan unggah gambar atau video terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuotes(null);
    setGeneratedVisual(null);
    setErrorVisual(null);
    setActiveQuote(null);

    try {
      setLoadingMessage('Menganalisis visual...');
      const description = await analyzeImage(uploadedFile.base64, uploadedFile.mimeType);

      setLoadingMessage('Menciptakan kutipan inspiratif...');
      const generatedQuotes = await generateQuotes(description, theme, instructions);
      setQuotes(generatedQuotes);
      if (generatedQuotes && generatedQuotes.length > 0) {
        setActiveQuote(generatedQuotes[0]);
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan tidak dikenal.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleCreateVisual = async (quote: QuoteOption) => {
    if (!uploadedFile || uploadedFile.mimeType.startsWith('video/')) {
        setErrorVisual("Fitur ini hanya tersedia untuk gambar.");
        return;
    }

    setIsCreatingVisual(quote.id);
    setGeneratedVisual(null);
    setErrorVisual(null);

    try {
        const newImageData = await createVisualWithQuote(
            uploadedFile.base64, 
            uploadedFile.mimeType, 
            quote.teks, 
            placement, 
            frame,
            logoFile?.base64 ?? null,
            logoFile?.mimeType ?? null,
            logoPlacement,
            brandText
        );
        setGeneratedVisual(`data:image/png;base64,${newImageData}`);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Gagal membuat visual.';
        setErrorVisual(errorMessage);
    } finally {
        setIsCreatingVisual(null);
    }
};

  const hasOutput = isLoading || error || quotes || generatedVisual;

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-white">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          
          {/* Input Section */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col gap-8">
            <div className="border-b-2 border-purple-500/30 pb-4">
                <h2 className="text-2xl font-semibold text-purple-300">Langkah 1: Atur Kreasi Anda</h2>
                <p className="mt-2 text-sm text-gray-400">Unggah media, pilih gaya teks, bingkai, dan branding Anda. Semua pengaturan di sini akan tercermin dalam pratinjau langsung.</p>
            </div>
            
            {uploadedFile?.previewUrl ? (
                <div>
                    <MediaPreview 
                        file={uploadedFile}
                        quoteText={activeQuote?.teks}
                        placement={placement}
                        frame={frame}
                        onClear={handleClearMedia}
                        logoFile={logoFile}
                        logoPlacement={logoPlacement}
                        brandText={brandText}
                    />
                </div>
            ) : (
                <ImageUploader onFileSelect={handleFileSelect} />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PlacementSelector selectedPlacement={placement} onPlacementChange={setPlacement} />
              <FrameSelector selectedFrame={frame} onFrameChange={setFrame} />
            </div>
            
            <div className="border-t border-gray-700 pt-6">
                 <h3 className="text-xl font-medium text-gray-200">Branding (Opsional)</h3>
                 <p className="mt-1 text-sm text-gray-400 mb-4">Tambahkan identitas visual pada karya Anda. Unggah logo, ketik nama merek, dan atur posisinya.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="flex flex-col gap-4">
                        <LogoUploader onLogoSelect={handleLogoSelect} onLogoClear={handleClearLogo} logoPreviewUrl={logoFile?.previewUrl ?? null}/>
                        <BrandTextInput value={brandText} onChange={setBrandText} />
                    </div>
                    <div className="h-full">
                        <LogoPlacementSelector selectedPlacement={logoPlacement} onPlacementChange={setLogoPlacement}/>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-300">Tema Kutipan</label>
                <p className="text-xs text-gray-400 mb-2">Bantu AI memahami nuansa yang Anda inginkan. Contoh: 'Petualangan', 'Ketenangan Jiwa'.</p>
                <input 
                  type="text" 
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Contoh: Semangat Pagi"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
              </div>
              
              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-300">Instruksi Tambahan</label>
                 <p className="text-xs text-gray-400 mb-2">Berikan arahan lebih spesifik untuk gaya kutipan. Contoh: 'Gunakan bahasa puitis', 'Singkat dan tegas'.</p>
                <input 
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Contoh: Fokus pada awal yang baru"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !uploadedFile}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/50 transform hover:scale-105"
            >
              {isLoading ? 'AI sedang berpikir...' : 'Buatkan Kutipan!'}
            </button>
          </div>

          {/* Output Section */}
          {hasOutput && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="border-b-2 border-purple-500/30 pb-4">
                <h2 className="text-2xl font-semibold text-purple-300">Langkah 2: Pilih & Hasilkan</h2>
                <p className="mt-2 text-sm text-gray-400">Inilah keajaiban AI. Pilih kutipan favorit Anda, lihat pratinjau langsung, dan hasilkan visual akhir untuk diunduh.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* Quote Results Column */}
                <div className="flex flex-col gap-4">
                    {isLoading && <Loader message={loadingMessage} />}
                    {error && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">{error}</div>}
                    {quotes && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-200">Pilih Kutipan Favorit Anda:</h3>
                        {quotes.map(quote => <QuoteCard 
                            key={quote.id} 
                            quote={quote}
                            onSelect={() => setActiveQuote(quote)}
                            isActive={activeQuote?.id === quote.id}
                            onCreateVisual={() => handleCreateVisual(quote)}
                            isCreating={isCreatingVisual === quote.id}
                            isMediaVideo={uploadedFile?.mimeType.startsWith('video/') ?? false}
                        />)}
                      </div>
                    )}
                </div>

                {/* Visual Results Column */}
                <div className="flex flex-col gap-4 sticky top-24">
                  {isCreatingVisual !== null && <Loader message="Menggabungkan kutipan dengan gambar..." />}
                  {errorVisual && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">{errorVisual}</div>}
                  
                  {generatedVisual ? (
                      <div className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700 flex flex-col gap-4">
                          <h3 className="text-xl font-semibold text-gray-200">Visual Hasil Karya AI</h3>
                          <img src={generatedVisual} alt="Generated visual with quote" className="w-full h-auto rounded-lg" />
                          <a
                              href={generatedVisual}
                              download="kutipan-visual.png"
                              className="text-center w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                          >
                              Unduh Gambar
                          </a>
                      </div>
                  ) : (
                    uploadedFile && quotes && (
                        <div className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700 flex flex-col gap-4">
                            <h3 className="text-xl font-semibold text-gray-200">Pratinjau Langsung</h3>
                            <MediaPreview 
                                file={uploadedFile}
                                quoteText={activeQuote?.teks}
                                placement={placement}
                                frame={frame}
                                onClear={handleClearMedia}
                                logoFile={logoFile}
                                logoPlacement={logoPlacement}
                                brandText={brandText}
                            />
                            {uploadedFile.mimeType.startsWith('image/') && (
                                <div className="text-center text-gray-400 text-sm p-3 bg-gray-900/50 rounded-md">
                                  <p>
                                    Pilih kutipan dan klik ikon 
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mx-1" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                    di atas untuk membuat visual Anda.
                                  </p>
                                </div>
                            )}
                        </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;