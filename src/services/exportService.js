import { supabase } from '../config/supabaseClient.js'
import fs from 'fs'
import path from 'path'

const STORAGE_DIR = path.resolve('storage')

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true })
}

// Recursive function to get all files from a Supabase bucket
const listAllSupabaseFiles = async (bucketName, folderPath = '') => {
  const { data, error } = await supabase.storage.from(bucketName).list(folderPath)
  if (error) {
    throw new Error(`Failed to list files in ${folderPath || 'root'}: ${error.message}`)
  }

  let allFiles = []
  for (const item of data) {
    if (item.name === '.emptyFolderPlaceholder') continue

    const itemPath = folderPath ? `${folderPath}/${item.name}` : item.name

    // Supabase folders typically don't have an id property in the list response
    if (!item.id) {
      // It's a folder, recursively list its contents
      const subFiles = await listAllSupabaseFiles(bucketName, itemPath)
      allFiles = allFiles.concat(subFiles)
    } else {
      // It's a file
      allFiles.push(itemPath)
    }
  }
  return allFiles
}

export const exportStorage = async (bucketName) => {
  if (!bucketName) {
    throw new Error('Bucket name is required')
  }

  // List all files in the bucket, including nested folders
  const allFiles = await listAllSupabaseFiles(bucketName)
  const results = []

  for (const filePath of allFiles) {
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(filePath)

    if (downloadError) {
      results.push({ file: filePath, status: 'failed', error: downloadError.message })
      continue
    }

    // Convert Blob to Buffer
    const buffer = Buffer.from(await fileData.arrayBuffer())

    // Create nested directories locally
    const localFilePath = path.join(STORAGE_DIR, filePath)
    const dirPath = path.dirname(localFilePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    fs.writeFileSync(localFilePath, buffer)
    results.push({ file: filePath, status: 'success' })
  }

  return results
}
