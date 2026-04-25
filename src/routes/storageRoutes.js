import express from 'express'
import { exportFiles } from '../controllers/exportController.js'
import { importFiles } from '../controllers/importController.js'

const router = express.Router()

// POST /api/storage/export
router.post('/export', exportFiles)

// POST /api/storage/import
router.post('/import', importFiles)

export default router
