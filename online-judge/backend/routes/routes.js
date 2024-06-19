import express from 'express'
import { uploadImage } from '../controllers/image-controller.js';
import upload from '../utils/upload.js';

const router  = express.Router();

router.post('/upload', upload.single('user'), uploadImage)

export default router;