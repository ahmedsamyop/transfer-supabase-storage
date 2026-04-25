import { exportStorage } from '../services/exportService.js';
import dotenv from 'dotenv';

dotenv.config();

export const exportFiles = async (req, res) => {
  try {
    const bucketName = req.body.bucketName || process.env.SUPABASE_BUCKET_NAME;
    const results = await exportStorage(bucketName);
    res.status(200).json({ message: 'Export completed', results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
