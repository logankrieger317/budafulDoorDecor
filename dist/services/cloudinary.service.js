"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
class CloudinaryService {
    constructor() {
        // Removed the explicit configuration of cloudinary
    }
    /**
     * Upload a file to Cloudinary
     * @param dataUri The data URI to upload
     * @param sku The SKU of the product
     */
    async uploadImage(dataUri, sku) {
        try {
            const result = await cloudinary_1.default.uploader.upload(dataUri, {
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
        }
        catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw new Error('Failed to upload image to Cloudinary');
        }
    }
    /**
     * Delete an image from Cloudinary
     * @param publicId The public ID of the image to delete
     */
    async deleteImage(publicId) {
        try {
            await cloudinary_1.default.uploader.destroy(publicId);
        }
        catch (error) {
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
    getOptimizedUrl(publicId, width, height) {
        return cloudinary_1.default.url(publicId, {
            width,
            height,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto'
        });
    }
}
exports.CloudinaryService = CloudinaryService;
