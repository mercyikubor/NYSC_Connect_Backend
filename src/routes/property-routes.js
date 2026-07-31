import express from 'express';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  verifyProperty,
} from '../controllers/propertyController.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

const protect = (req, res, next) => next();
const authorizeAdmin = (req, res, next) => next();

router.get('/', getProperties);
router.get('/:id', getPropertyById);

router.post('/', protect, upload.array('images', 5), createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

router.patch('/:id/verify', protect, authorizeAdmin, verifyProperty);

export default router;