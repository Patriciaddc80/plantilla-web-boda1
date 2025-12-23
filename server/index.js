import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Ruta para el archivo de datos
const dataDir = path.join(__dirname, 'data')
const rsvpFile = path.join(dataDir, 'rsvp.json')

// Asegurar que el directorio existe
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Inicializar archivo JSON si no existe
if (!fs.existsSync(rsvpFile)) {
  fs.writeFileSync(rsvpFile, JSON.stringify([], null, 2))
}

// Endpoint para recibir RSVP
app.post('/api/rsvp', (req, res) => {
  try {
    const { name, email, guests, attendance, message } = req.body

    // Validación básica
    if (!name || !email || !attendance) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: name, email, attendance' 
      })
    }

    // Leer datos existentes
    const existingData = JSON.parse(fs.readFileSync(rsvpFile, 'utf8'))

    // Crear nuevo registro
    const newRSVP = {
      id: Date.now().toString(),
      name,
      email,
      guests: attendance === 'yes' ? (guests || '1') : '0',
      attendance,
      message: message || '',
      submittedAt: new Date().toISOString()
    }

    // Agregar nuevo registro
    existingData.push(newRSVP)

    // Guardar en archivo
    fs.writeFileSync(rsvpFile, JSON.stringify(existingData, null, 2))

    res.status(200).json({ 
      success: true, 
      message: 'RSVP guardado correctamente',
      data: newRSVP
    })
  } catch (error) {
    console.error('Error al guardar RSVP:', error)
    res.status(500).json({ 
      error: 'Error al guardar el RSVP',
      details: error.message 
    })
  }
})

// Endpoint para obtener todos los RSVPs
app.get('/api/rsvp', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(rsvpFile, 'utf8'))
    res.status(200).json({ success: true, data })
  } catch (error) {
    console.error('Error al leer RSVPs:', error)
    res.status(500).json({ 
      error: 'Error al leer los RSVPs',
      details: error.message 
    })
  }
})

// Endpoint para obtener estadísticas
app.get('/api/rsvp/stats', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(rsvpFile, 'utf8'))
    const stats = {
      total: data.length,
      attending: data.filter(r => r.attendance === 'yes').length,
      notAttending: data.filter(r => r.attendance === 'no').length,
      totalGuests: data
        .filter(r => r.attendance === 'yes')
        .reduce((sum, r) => sum + parseInt(r.guests || 1), 0)
    }
    res.status(200).json({ success: true, stats })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    res.status(500).json({ 
      error: 'Error al obtener estadísticas',
      details: error.message 
    })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📝 Archivo de datos: ${rsvpFile}`)
})

