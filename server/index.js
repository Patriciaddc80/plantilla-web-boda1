import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sendRSVPEmail } from './emailService.js'
import { updateExcelFile } from './excelService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Middleware para asegurar que todas las respuestas sean JSON
app.use((req, res, next) => {
  // Guardar el método json original
  const originalJson = res.json.bind(res)
  
  // Sobrescribir el método json para asegurar content-type
  res.json = function(data) {
    res.setHeader('Content-Type', 'application/json')
    return originalJson(data)
  }
  
  next()
})

// Middleware para manejar errores de parsing JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      success: false,
      error: 'Error en el formato JSON de la petición' 
    })
  }
  next()
})

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

    // Asegurar que el directorio existe
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Leer datos existentes o inicializar array vacío
    let existingData = []
    if (fs.existsSync(rsvpFile)) {
      try {
        const fileContent = fs.readFileSync(rsvpFile, 'utf8')
        existingData = fileContent.trim() ? JSON.parse(fileContent) : []
      } catch (parseError) {
        console.error('Error al leer archivo RSVP, inicializando nuevo:', parseError)
        existingData = []
      }
    }

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

    // Guardar en archivo JSON
    fs.writeFileSync(rsvpFile, JSON.stringify(existingData, null, 2), 'utf8')

    // Actualizar archivo Excel
    try {
      const excelResult = updateExcelFile(existingData)
      if (excelResult.success) {
        console.log(`✅ Excel actualizado: ${excelResult.recordCount} registros`)
      } else {
        console.warn('⚠️  No se pudo actualizar el archivo Excel:', excelResult.error)
      }
    } catch (excelError) {
      console.error('❌ Error al actualizar Excel (no crítico):', excelError)
      // No lanzamos el error porque el RSVP ya se guardó en JSON
    }

    // Responder al cliente primero (antes de intentar enviar email)
    res.status(200).json({ 
      success: true, 
      message: 'RSVP guardado correctamente',
      data: newRSVP
    })

    // Enviar email de notificación de forma completamente asíncrona (no bloquea la respuesta)
    // Esto se ejecuta después de enviar la respuesta, así que nunca puede causar un error 500
    console.log('📧 Iniciando proceso de envío de email...')
    setImmediate(() => {
      try {
        const recipientEmail = process.env.RSVP_NOTIFICATION_EMAIL || process.env.SMTP_USER
        console.log('📧 Email destinatario configurado:', recipientEmail)
        console.log('📧 Datos del RSVP:', JSON.stringify(newRSVP, null, 2))
        
        if (recipientEmail) {
          console.log('📤 Enviando email de notificación...')
          // En desarrollo local, el emailService leerá el archivo del disco
          sendRSVPEmail(newRSVP, recipientEmail, null)
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
      } catch (emailError) {
        // Esto nunca debería ejecutarse, pero por seguridad lo capturamos
        console.error('❌ Error inesperado al intentar enviar email:', emailError)
        console.error('📋 Stack:', emailError.stack)
      }
    })
  } catch (error) {
    console.error('Error al guardar RSVP:', error)
    // Asegurar que siempre se responda con JSON
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false,
        error: 'Error al guardar el RSVP',
        details: error.message 
      })
    } else {
      console.error('⚠️  No se pudo enviar respuesta de error porque ya se envió una respuesta')
    }
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

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason)
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📝 Archivo de datos: ${rsvpFile}`)
  console.log(`✅ Servidor listo para recibir peticiones`)
})

