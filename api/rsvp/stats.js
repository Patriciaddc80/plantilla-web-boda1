import { kv } from '@vercel/kv'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Usar Vercel KV en producción, archivos en desarrollo local
const useKV = process.env.VERCEL || process.env.KV_REST_API_URL
const KV_KEY = 'rsvp:data'

// Para desarrollo local: usar archivos
const dataDir = path.join(__dirname, '../../server/data')
const rsvpFile = path.join(dataDir, 'rsvp.json')

// Función helper para obtener datos
async function getRSVPData() {
  if (useKV) {
    try {
      const data = await kv.get(KV_KEY)
      return data || []
    } catch (error) {
      console.error('Error al leer de KV:', error)
      return []
    }
  } else {
    // Desarrollo local: usar archivos
    if (fs.existsSync(rsvpFile)) {
      try {
        const fileContent = fs.readFileSync(rsvpFile, 'utf8')
        return fileContent.trim() ? JSON.parse(fileContent) : []
      } catch (error) {
        console.error('Error al leer archivo:', error)
        return []
      }
    }
    return []
  }
}

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      const data = await getRSVPData()
      
      const stats = {
        total: data.length,
        attending: data.filter(r => r.attendance === 'yes').length,
        notAttending: data.filter(r => r.attendance === 'no').length,
        totalGuests: data
          .filter(r => r.attendance === 'yes')
          .reduce((sum, r) => sum + Number.parseInt(r.guests || 1, 10), 0)
      }
      
      return res.status(200).json({ success: true, stats })
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      return res.status(500).json({ 
        success: false,
        error: 'Error al obtener estadísticas',
        details: error.message 
      })
    }
  }

  // Método no permitido
  return res.status(405).json({ 
    success: false,
    error: 'Método no permitido' 
  })
}

