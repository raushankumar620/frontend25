export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export const uploadService = {
  async uploadFile(file: File): Promise<UploadResult> {
    await new Promise((res) => setTimeout(res, 800));
    return {
      url: URL.createObjectURL(file),
      filename: file.name,
      size: file.size,
      mimeType: file.type,
    };
  },
};
