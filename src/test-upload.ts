import { CloudinaryService } from './services/cloudinary.service';
import * as path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from the root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testUpload() {
  try {
    const cloudinaryService = new CloudinaryService();
    
    // Path to test image
    const imagePath = path.join(__dirname, '..', 'test', 'images', 'test-ribbon.jpg');
    
    // Test SKU
    const sku = 'TEST-RIB-001';

    console.log('Starting upload test...');
    console.log('Image path:', imagePath);
    console.log('Environment variables loaded:', {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Yes' : 'No',
      apiKey: process.env.CLOUDINARY_API_KEY ? 'Yes' : 'No',
      apiSecret: process.env.CLOUDINARY_API_SECRET ? 'Yes' : 'No'
    });

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.error('Test image not found at:', imagePath);
      return;
    }

    // Upload the image
    const result = await cloudinaryService.uploadImage(imagePath, sku);
    
    console.log('Upload successful!');
    console.log('Image URL:', result.url);
    console.log('Public ID:', result.publicId);
    console.log('Version:', result.version);

    // Test getting optimized URL
    const thumbnailUrl = cloudinaryService.getOptimizedUrl(result.publicId, 200, 200);
    console.log('\nThumbnail URL:', thumbnailUrl);

  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Run the test
testUpload();
