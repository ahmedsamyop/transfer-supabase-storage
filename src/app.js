import express from 'express'
import storageRoutes from './routes/storageRoutes.js'

const app = express()

// Middleware
app.use(express.json())

// Routes
app.use('/api/storage', storageRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' })
})

export default app
