
export interface GenerationState {
  status: 'idle' | 'generating-image' | 'generating-3d' | 'completed' | 'error';
  imageUrl?: string;
  modelUrl?: string;
  error?: string;
  progressMessage?: string;
}

export interface KnifeMetadata {
  prompt: string;
  style: string;
}
