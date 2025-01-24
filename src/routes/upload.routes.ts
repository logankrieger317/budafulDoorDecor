import express from 'express';
import multer from 'multer';
import { CloudinaryService } from '../services/cloudinary.service';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const cloudinaryService = new CloudinaryService();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Check file type
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});

// Upload image route
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate a unique SKU for the image
    const sku = req.body.sku || `IMG-${uuidv4()}`;

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

    // Upload to Cloudinary
    const result = await cloudinaryService.uploadImage(dataURI, sku);

    res.json({
      url: result.url,
      publicId: result.publicId,
      version: result.version
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image route
router.delete('/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinaryService.deleteImage(publicId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
