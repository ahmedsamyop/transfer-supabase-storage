import { importStorage } from '../services/importService.js'
import dotenv from 'dotenv'

dotenv.config()

export const importFiles = async (req, res) => {
  try {
    const bucketName = req.body.bucketName || process.env.SUPABASE_BUCKET_NAME
    const results = await importStorage(bucketName)
    res.status(200).json({ message: 'Import completed', results })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
