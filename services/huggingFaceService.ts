import { Client } from "@gradio/client";

/**
 * Image-to-3D (TRELLIS.2) -> GLB -> FBX Conversion (API Based)
 * Bu kod tamamen server-side (Node.js/Vercel) uyumludur.
 */
export const convertImageToFbx = async (base64Image: string): Promise<string> => {
  const hfToken = (process.env as any).HUGGINGFACE_API_KEY;

  try {
    // 1. TRELLIS API BAĞLANTISI
    const trellisApp = await Client.connect("microsoft/TRELLIS", {
      hf_token: `Bearer ${hfToken}`
    });

    // Görüntüyü Blob'a hazırla
    const response_blob = await fetch(base64Image);
    const imageBlob = await response_blob.blob();

    // 2. ADIM: PREPROCESS
    const preprocess_result = await trellisApp.predict("/preprocess_image", {
      input: imageBlob, 
    }) as any;

    // 3. ADIM: GENERATE 3D
    await trellisApp.predict("/image_to_3d", {
      image: preprocess_result.data[0],
      seed: Math.floor(Math.random() * 100000),
      resolution: "1024",
      ss_guidance_strength: 7.5,
      ss_sampling_steps: 12,
      shape_slat_guidance_strength: 7.5,
      shape_slat_sampling_steps: 12,
      tex_slat_guidance_strength: 1,
      tex_slat_sampling_steps: 12,
    });

    // 4. ADIM: EXTRACT GLB
    const glb_result = await trellisApp.predict("/extract_glb", {
      decimation_target: 300000,
      texture_size: 2048,
    }) as any;

    const glbUrl = glb_result.data[0].url;

    // 5. ADIM: SERVER-SIDE FBX CONVERSION
    // Not: Dönüşümü yapan başka bir Hugging Face Space'i (veya kendi Python API'nı) kullanıyoruz
    // Alternatif olarak: 'ModelConvert/GLB-to-FBX' gibi bir space kullanılabilir
    const converterApp = await Client.connect("fffiloni/GLB-to-FBX-converter", {
      hf_token: `Bearer ${hfToken}`
    });

    const fbx_result = await converterApp.predict("/convert", {
      glb_file: handle_file(glbUrl) // Gradio yardımcı fonksiyonu
    }) as any;

    // Sonuç FBX URL'sini dön
    return fbx_result.data[0].url;

  } catch (error) {
    console.error("TRELLIS -> FBX Dönüşüm Hatası:", error);
    throw new Error("3D model süreci başarısız oldu. Sunucu yapılandırmasını kontrol edin.");
  }
};

// Yardımcı fonksiyon (Gradio Client bazen bunu ister)
function handle_file(url: string) {
    return { path: url, is_stream: false };
}