import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuoteOption, PlacementOption, FrameOption, LogoPlacementOption } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quotesSchema = {
  type: Type.OBJECT,
  properties: {
    opsi_kutipan: {
      type: Type.ARRAY,
      description: "An array of 3 quote options.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER, description: "Unique ID for the quote." },
          teks: { type: Type.STRING, description: "The motivational quote text." },
        },
        required: ["id", "teks"],
      },
    },
  },
  required: ["opsi_kutipan"],
};

export const analyzeImage = async (base64Data: string, mimeType: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const prompt = `Describe this visual media in detail. Focus on the main subjects, colors, mood, and overall atmosphere. The description should be objective and suitable for a creative writer. For example: "A photo of a sunrise over mountains. Dominant colors are orange, yellow, and purple. The atmosphere is calm, peaceful, and hopeful. No human objects are visible, only nature."`;

    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType: mimeType,
        },
    };
    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error("Failed to analyze image with Gemini API.");
    }
};


export const generateQuotes = async (imageDescription: string, theme: string, instructions: string): Promise<QuoteOption[]> => {
    const model = 'gemini-2.5-flash';
    const prompt = `
# PERAN DAN TUJUAN
Anda adalah seorang penulis motivasi dan ahli semiotika visual yang sangat kreatif. Tugas Anda adalah menciptakan kata-kata motivasi yang singkat, kuat, dan relevan secara emosional berdasarkan analisis sebuah media visual (foto atau video) yang diunggah oleh pengguna.

# KONTEKS
Pengguna telah mengunggah sebuah media dan ingin Anda membuatkan beberapa opsi kutipan inspiratif yang cocok dengan visual dan suasana yang terkandung di dalamnya.

# DATA INPUT
- Tipe Media: [FOTO / VIDEO]
- Deskripsi Hasil Analisis Visual AI: [${imageDescription}]
- Tema yang Dipilih Pengguna (jika ada): [${theme || 'Tidak ada'}]
- Instruksi Tambahan (jika ada): [${instructions || 'Tidak ada'}]

# TUGAS ANDA
1.  Baca dan pahami semua data input di atas.
2.  Berdasarkan analisis visual, tema, dan instruksi tambahan, buatkan **3 (tiga) opsi** kata-kata motivasi dalam Bahasa Indonesia.
3.  Setiap opsi harus:
    *   **Singkat dan Padat:** Idealnya tidak lebih dari 15 kata.
    *   **Relevan dengan Visual:** Harus terasa menyatu dengan gambar/video.
    *   **Inspiratif dan Positif:** Memberikan dorongan semangat atau perenungan.
    *   **Variatif:** Setiap opsi harus menawarkan sudut pandang atau gaya bahasa yang sedikit berbeda (misal: satu puitis, satu lugas, satu filosofis).

# FORMAT OUTPUT
Berikan jawaban Anda dalam format JSON yang ketat agar mudah diproses oleh aplikasi. Jangan tambahkan teks atau penjelasan lain di luar format JSON ini.
`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quotesSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && result.opsi_kutipan) {
            return result.opsi_kutipan;
        } else {
            throw new Error("Invalid JSON structure received from API.");
        }

    } catch (error) {
        console.error("Error generating quotes:", error);
        throw new Error("Gagal menghasilkan kutipan. Silakan coba lagi.");
    }
};

export const createVisualWithQuote = async (
    base64ImageData: string, 
    mimeType: string, 
    quoteText: string, 
    placement: PlacementOption, 
    frame: FrameOption,
    logoBase64: string | null,
    logoMimeType: string | null,
    logoPlacement: LogoPlacementOption,
    brandText: string | null
): Promise<string> => {
    const model = 'gemini-2.5-flash-image-preview';

    const placementInstructions: { [key in PlacementOption]: string } = {
        atas: 'at the top',
        bawah: 'at the bottom',
    };
    
    const frameInstructions: { [key in FrameOption]?: string } = {
        sederhana: 'a simple and thin black border',
        elegan: 'an elegant, ornate silver frame',
        modern: 'a clean, minimalist white frame',
        vintage: 'a rustic, distressed wooden frame',
    };

    const logoPlacementInstructions: { [key in LogoPlacementOption]: string } = {
        'atas-kiri': 'top-left corner',
        'atas-kanan': 'top-right corner',
        'bawah-kiri': 'bottom-left corner',
        'bawah-kanan': 'bottom-right corner',
    };

    const placementInstruction = placementInstructions[placement] || 'at the bottom';
    const frameInstruction = frameInstructions[frame] || '';

    let prompt = `Artistically and beautifully overlay the following text onto the main image. Place the text **${placementInstruction}** of the image. The text should be legible, well-placed, and complement the image's mood and composition.`;

    if (frameInstruction) {
        prompt += ` Also, add ${frameInstruction} around the entire image.`;
    }
    
    const parts: any[] = [{
        inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
        },
    }];

    const logoPlacementInstruction = logoPlacementInstructions[logoPlacement];
    let brandingInstruction = "";

    if (logoBase64 && logoMimeType) {
        parts.push({
            inlineData: {
                data: logoBase64,
                mimeType: logoMimeType,
            }
        });

        if (brandText) {
            // Both logo and text
            brandingInstruction = `Also, place the provided logo image at the **${logoPlacementInstruction}** and write the brand name "${brandText}" next to or under it. The branding should be subtle, clear, and well-integrated.`;
        } else {
            // Logo only
            brandingInstruction = `Also, place the provided logo image at the **${logoPlacementInstruction}**. The logo should be integrated naturally but remain clear and not too large.`;
        }
    } else if (brandText) {
        // Text only
        brandingInstruction = `Also, write the following brand name as a watermark at the **${logoPlacementInstruction}**: "${brandText}". Make it subtle but legible.`;
    }
    
    if (brandingInstruction) {
        prompt += ` ${brandingInstruction}`;
    }

    prompt += ` Text: "${quoteText}"`;
    parts.push({ text: prompt });


    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: parts,
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("API did not return an image. It might have returned text instead: " + response.text);

    } catch (error) {
        console.error("Error creating visual with quote:", error);
        throw new Error("Gagal membuat visual dengan kutipan. Silakan coba lagi.");
    }
};