import { kv } from '@vercel/kv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { sendRSVPEmail } from '../server/emailService.js'
import { generateExcelBuffer } from './excelService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Usar Vercel KV en producción, archivos en desarrollo local
const useKV = process.env.VERCEL || process.env.KV_REST_API_URL
const KV_KEY = 'rsvp:data'

// Para desarrollo local: usar archivos
const dataDir = path.join(__dirname, '../server/data')
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
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
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

// Función helper para guardar datos
async function saveRSVPData(data) {
  if (useKV) {
    try {
      await kv.set(KV_KEY, data)
      return true
    } catch (error) {
      console.error('Error al guardar en KV:', error)
      return false
    }
  } else {
    // Desarrollo local: usar archivos
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    try {
      fs.writeFileSync(rsvpFile, JSON.stringify(data, null, 2), 'utf8')
      return true
    } catch (error) {
      console.error('Error al guardar archivo:', error)
      return false
    }
  }
}

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      const data = await getRSVPData()
      return res.status(200).json({ success: true, data })
    } catch (error) {
      console.error('Error al leer RSVPs:', error)
      return res.status(500).json({ 
        success: false,
        error: 'Error al leer los RSVPs',
        details: error.message 
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, guests, attendance, message } = req.body

      // Validación básica
      if (!name || !email || !attendance) {
        return res.status(400).json({ 
          success: false,
          error: 'Faltan campos requeridos: name, email, attendance' 
        })
      }

      // Validar formato de email básico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'El formato del email no es válido'
        })
      }

      // Leer datos existentes
      const existingData = await getRSVPData()

      // Crear nuevo registro
      const newRSVP = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        guests: attendance === 'yes' ? (guests || '1') : '0',
        attendance,
        message: (message || '').trim(),
        submittedAt: new Date().toISOString()
      }

      // Agregar nuevo registro
      existingData.push(newRSVP)

      // Guardar datos
      const saved = await saveRSVPData(existingData)
      if (!saved) {
        console.warn('⚠️  No se pudo guardar el RSVP, pero el email se enviará')
      }

      // Generar Excel en memoria para adjuntar al email (en producción/serverless)
      let excelBuffer = null
      try {
        excelBuffer = generateExcelBuffer(existingData)
        console.log('✅ Excel generado en memoria para adjuntar al email')
      } catch (excelError) {
        console.warn('⚠️  No se pudo generar Excel en memoria:', excelError)
        // Continuar sin Excel adjunto
      }

      // Responder al cliente primero
      res.status(200).json({ 
        success: true, 
        message: 'RSVP guardado correctamente',
        data: newRSVP
      })

      // Enviar email de notificación de forma asíncrona
      console.log('📧 Iniciando proceso de envío de email...')
      const recipientEmail = process.env.RSVP_NOTIFICATION_EMAIL || process.env.SMTP_USER
      console.log('📧 Email destinatario configurado:', recipientEmail)
      console.log('📧 Datos del RSVP:', JSON.stringify(newRSVP, null, 2))
      
      if (recipientEmail) {
        console.log('📤 Enviando email de notificación...')
        // Pasar el Excel buffer si existe
        sendRSVPEmail(newRSVP, recipientEmail, excelBuffer)
          .then(result => {
            if (result.success) {
              console.log('✅ Email de notificación enviado correctamente')
              console.log('📬 Message ID:', result.messageId || 'N/A')
            } else {
              console.error('❌ No se pudo enviar el email:', result.error)
              console.error('📋 Detalles:', JSON.stringify(result, null, 2))
            }
          })
          .catch(error => {
            console.error('❌ Error al enviar email (no crítico):', error)
            console.error('📋 Stack:', error.stack)
          })
      } else {
        console.error('❌ No se configuró RSVP_NOTIFICATION_EMAIL. El email no se enviará.')
        console.error('📋 Variables de entorno disponibles:', {
          RSVP_NOTIFICATION_EMAIL: process.env.RSVP_NOTIFICATION_EMAIL,
          SMTP_USER: process.env.SMTP_USER
        })
      }

      return
    } catch (error) {
      console.error('Error al guardar RSVP:', error)
      return res.status(500).json({ 
        success: false,
        error: 'Error al guardar el RSVP',
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

