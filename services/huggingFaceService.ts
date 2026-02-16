
/**
 * Service to interact with Hugging Face for Image-to-3D.
 * Note: This requires a Hugging Face API Token. 
 * For this demo, we assume HUGGINGFACE_API_KEY is in the environment.
 */

export const convertImageTo3D = async (base64Image: string): Promise<string> => {
  const hfToken = (process.env as any).HUGGINGFACE_API_KEY;
  
  // Extract pure base64
  const base64Data = base64Image.split(',')[1];
  const blob = await (await fetch(`data:image/png;base64,${base64Data}`)).blob();

  /**
   * We use the 'google/shap-e' model which is reliable for quick Image-to-3D on HF.
   * Alternatives: 'TencentARC/InstantMesh' (if available via inference API)
   */
  const modelId = "google/shap-e"; 
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${modelId}`,
    {
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: blob,
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    // If the model is loading, we might need to retry, but for this demo we'll throw.
    if (response.status === 503) {
      throw new Error("The 3D generation model is currently loading. Please try again in a minute.");
    }
    throw new Error(`Hugging Face API Error: ${errText || response.statusText}`);
  }

  const resultBlob = await response.blob();
  return URL.createObjectURL(resultBlob);
};
