"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_service_1 = require("./services/cloudinary.service");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from the root directory
dotenv_1.default.config({ path: path.join(__dirname, '..', '.env') });
async function testUpload() {
    try {
        const cloudinaryService = new cloudinary_service_1.CloudinaryService();
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
    }
    catch (error) {
        console.error('Error during test:', error);
    }
}
// Run the test
testUpload();
