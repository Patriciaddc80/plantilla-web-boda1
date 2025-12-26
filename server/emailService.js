import nodemailer from 'nodemailer'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRSVPEmailTemplate } from './emailTemplate.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuración del transporter de email
// Puedes usar Gmail, Outlook, o cualquier otro servicio SMTP
const createTransporter = () => {
  // Configuración usando variables de entorno
  // Para Gmail, necesitarás una "Contraseña de aplicación" en lugar de tu contraseña normal
  // Limpiar espacios de la contraseña si existen (Gmail app passwords pueden tener espacios)
  const cleanPassword = process.env.SMTP_PASS.replaceAll(/\s+/g, '')
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number.parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER, // Tu email
      pass: cleanPassword, // Contraseña sin espacios
    },
  })
}

// Validar configuración SMTP
function validateSMTPConfig() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  Variables de entorno SMTP no configuradas. El email no se enviará.')
    console.warn('   Configura SMTP_USER y SMTP_PASS en el archivo .env')
    return { valid: false, error: 'Configuración de email no disponible' }
  }

  if (process.env.SMTP_PASS.includes('TU_CONTRASEÑA') || process.env.SMTP_PASS.includes('AQUÍ')) {
    console.warn('⚠️  La contraseña SMTP parece ser un placeholder. El email no se enviará.')
    return { valid: false, error: 'Configuración de email incompleta' }
  }

  return { valid: true }
}

// Crear attachments para el email
function createEmailAttachments(excelBuffer) {
  const attachments = []

  if (excelBuffer) {
    // Producción: usar el buffer generado en memoria
    attachments.push({
      filename: 'rsvp.xlsx',
      content: excelBuffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    console.log('📎 Archivo Excel adjuntado al email (desde buffer en memoria)')
  } else {
    // Desarrollo local: intentar leer el archivo del disco
    const excelFilePath = path.join(__dirname, '../server/data/rsvp.xlsx')
    if (fs.existsSync(excelFilePath)) {
      attachments.push({
        filename: 'rsvp.xlsx',
        path: excelFilePath,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      console.log('📎 Archivo Excel adjuntado al email (desde archivo en disco)')
    } else {
      console.warn('⚠️  El archivo Excel no existe, no se adjuntará al email')
    }
  }

  return attachments
}

// Crear texto plano del email
function createPlainTextEmail(rsvpData, hasAttachments) {
  return `
Nueva Confirmación de Asistencia - RSVP

Nombre: ${rsvpData.name}
Email: ${rsvpData.email}
Asistencia: ${rsvpData.attendance === 'yes' ? 'Sí asistirá' : 'No asistirá'}
${rsvpData.attendance === 'yes' ? `Número de invitados: ${rsvpData.guests}` : ''}
${rsvpData.message ? `Mensaje: ${rsvpData.message}` : ''}

Fecha de confirmación: ${new Date(rsvpData.submittedAt).toLocaleString('es-ES')}

${hasAttachments ? '\n📎 Se adjunta el archivo Excel actualizado con todos los RSVPs.' : ''}

---
Sistema de Gestión de RSVP
Manuela & Daniel
  `.trim()
}

// Crear y verificar transporter
async function createAndVerifyTransporter() {
  let transporter
  try {
    transporter = createTransporter()
  } catch (transporterError) {
    console.error('❌ Error al crear transporter de email:', transporterError.message)
    return { success: false, error: 'Error al configurar el servicio de email' }
  }

  try {
    console.log('🔍 Verificando conexión SMTP...')
    await transporter.verify()
    console.log('✅ Conexión SMTP verificada correctamente')
    return { success: true, transporter }
  } catch (verifyError) {
    console.error('❌ Error al verificar conexión SMTP:', verifyError.message)
    console.error('📋 Código de error:', verifyError.code)
    console.error('📋 Respuesta:', verifyError.response)
    return { 
      success: false, 
      error: `No se pudo conectar con el servidor de email: ${verifyError.message}` 
    }
  }
}

// Enviar email con transporter
async function sendEmailWithTransporter(transporter, mailOptions) {
  try {
    console.log('📤 Enviando email...')
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email enviado correctamente!')
    console.log('📬 Message ID:', info.messageId)
    console.log('📧 Respuesta del servidor:', info.response)
    return { success: true, messageId: info.messageId }
  } catch (sendError) {
    console.error('❌ Error al enviar email:', sendError.message)
    console.error('📋 Código de error:', sendError.code)
    console.error('📋 Respuesta:', sendError.response)
    if (sendError.code === 'EAUTH') {
      console.error('🔐 Error de autenticación. Verifica:')
      console.error('   1. Que estés usando una Contraseña de aplicación (no tu contraseña normal)')
      console.error('   2. Que la verificación en 2 pasos esté activada en Gmail')
      console.error('   3. Que la contraseña no tenga espacios o caracteres especiales incorrectos')
    }
    return { 
      success: false, 
      error: sendError.message || 'Error desconocido al enviar email',
      code: sendError.code
    }
  }
}

export async function sendRSVPEmail(rsvpData, recipientEmail, excelBuffer = null) {
  try {
    // Validar configuración SMTP
    const configValidation = validateSMTPConfig()
    if (!configValidation.valid) {
      return { success: false, error: configValidation.error }
    }
    
    console.log('📧 Intentando enviar email a:', recipientEmail)
    console.log('📧 Desde:', process.env.SMTP_USER)
    console.log('🔐 SMTP Host:', process.env.SMTP_HOST || 'smtp.gmail.com')

    if (!recipientEmail) {
      console.warn('⚠️  No se especificó un email destinatario')
      return { success: false, error: 'Email destinatario no especificado' }
    }

    // Crear y verificar transporter
    const transporterResult = await createAndVerifyTransporter()
    if (!transporterResult.success) {
      return { success: false, error: transporterResult.error }
    }
    const transporter = transporterResult.transporter

    // Crear attachments y contenido del email
    const attachments = createEmailAttachments(excelBuffer)
    const htmlContent = createRSVPEmailTemplate(rsvpData)

    // Configurar el email
    const mailOptions = {
      from: `"Boda Manuela & Daniel" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `💐 Nueva Confirmación de Asistencia - ${rsvpData.name}`,
      html: htmlContent,
      attachments: attachments,
      text: createPlainTextEmail(rsvpData, attachments.length > 0),
    }

    // Enviar el email
    return await sendEmailWithTransporter(transporter, mailOptions)
  } catch (error) {
    // Captura cualquier error inesperado
    console.error('❌ Error inesperado en sendRSVPEmail:', error)
    return { 
      success: false, 
      error: error.message || 'Error desconocido',
      details: error.toString()
    }
  }
}

