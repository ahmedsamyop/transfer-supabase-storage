import express from 'express'
import storageRoutes from './routes/storageRoutes.js'

const app = express()

// Middleware
app.use(express.json())

// Routes
app.use('/api/storage', storageRoutes)

export default app
