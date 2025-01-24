import cloudinary from '../config/cloudinary';

interface UploadResult {
  url: string;
  publicId: string;
  version: number;
}

export class CloudinaryService {
  constructor() {
    // Removed the explicit configuration of cloudinary
  }

  /**
   * Upload a file to Cloudinary
   * @param dataUri The data URI to upload
   * @param sku The SKU of the product
   */
  async uploadImage(dataUri: string, sku: string): Promise<UploadResult> {
    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'ribbons',
        public_id: sku,
        overwrite: true,
        resource_type: 'image'
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        version: result.version
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * Delete an image from Cloudinary
   * @param publicId The public ID of the image to delete
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw new Error('Failed to delete image from Cloudinary');
    }
  }

  /**
   * Get an optimized URL for a specific image size
   * @param publicId The public ID of the image
   * @param width Desired width
   * @param height Desired height
   */
  getOptimizedUrl(publicId: string, width: number, height: number): string {
    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    });
  }
}
