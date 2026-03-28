import express from 'express'
import dotenv from 'dotenv'
import airportsRouter from './routes/airports.js'
import flightsRouter from './routes/flights.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/airports', airportsRouter)
app.use('/api/flights', flightsRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
