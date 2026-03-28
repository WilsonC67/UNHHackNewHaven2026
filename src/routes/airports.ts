import { Router } from 'express'
import { getIata } from '../data/city_iata_map.js'
import type { ResolvedAirport } from '../types.js'

const router = Router()

router.post('/', (req, res) => {
  const { query } = req.body as { query: string }

  if (!query) {
    res.status(400).json({ success: false, error: 'query is required' })
    return
  }

  const iata = getIata(query)

  if (!iata) {
    res.status(404).json({ success: false, error: `No airport found for "${query}"` })
    return
  }

  const result: ResolvedAirport = {
    iata,
    name: query,
    city: query,
  }

  res.json({ success: true, data: result })
})

export default router
