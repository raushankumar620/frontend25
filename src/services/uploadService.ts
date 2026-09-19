import { apiClient } from './apiClient';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export const uploadService = {
  async uploadFile(file: File): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.upload<{ url: string; fileName: string; size: number; mimeType: string }>('/media/upload', formData);
      if (res.success && res.data?.url) {
        return {
          url: res.data.url,
          filename: res.data.fileName || file.name,
          size: res.data.size || file.size,
          mimeType: res.data.mimeType || file.type,
        };
      }
    } catch {
      // If server upload unavailable (e.g. offline/mock environment), use base64 / Object URL fallback
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: (reader.result as string) || URL.createObjectURL(file),
          filename: file.name,
          size: file.size,
          mimeType: file.type,
        });
      };
      reader.onerror = () => {
        resolve({
          url: URL.createObjectURL(file),
          filename: file.name,
          size: file.size,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    });
  },
};
