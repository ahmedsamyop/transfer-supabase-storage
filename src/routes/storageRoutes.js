import express from 'express'
import { exportFiles } from '../controllers/exportController.js'

const router = express.Router()

// POST /api/storage/export
router.post('/export', exportFiles)

export default router
