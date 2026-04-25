import { supabase } from '../config/supabaseClient.js'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'

const STORAGE_DIR = path.resolve('storage')

// Helper to get all files recursively from a directory
const getFilesRecursively = (dir, fileList = []) => {
  if (!fs.existsSync(dir)) return fileList
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursively(filePath, fileList)
    } else {
      fileList.push(filePath)
    }
  }
  return fileList
}

export const importStorage = async (bucketName) => {
  if (!bucketName) {
    throw new Error('Bucket name is required')
  }

  const filesToUpload = getFilesRecursively(STORAGE_DIR)
  const results = []

  for (const filePath of filesToUpload) {
    // Calculate relative path for bucket
    const relativePath = path.relative(STORAGE_DIR, filePath).replace(/\\/g, '/')
    const fileBuffer = fs.readFileSync(filePath)
    const contentType = mime.lookup(filePath) || 'application/octet-stream'

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(relativePath, fileBuffer, {
        upsert: true, // Overwrite existing files
        contentType: contentType,
      })

    if (error) {
      results.push({ file: relativePath, status: 'failed', error: error.message })
    } else {
      results.push({ file: relativePath, status: 'success' })
    }
  }

  return results
}
