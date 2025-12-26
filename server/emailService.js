import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRSVPEmailTemplate } from './emailTemplate.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuración del transporter de email
// Puedes usar Gmail, Outlook, o cualquier otro servicio SMTP
const createTransporter = () => {
  // Configuración usando variables de entorno
  // Para Gmail, necesitarás una "Contraseña de aplicación" en lugar de tu contraseña normal
    // Limpiar espacios de la contraseña si existen (Gmail app passwords pueden tener espacios)
    const cleanPassword = process.env.SMTP_PASS.replace(/\s+/g, '')
    
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER, // Tu email
        pass: cleanPassword, // Contraseña sin espacios
      },
    })
}

export async function sendRSVPEmail(rsvpData, recipientEmail) {
  try {
    // Validar que las variables de entorno estén configuradas
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️  Variables de entorno SMTP no configuradas. El email no se enviará.')
      console.warn('   Configura SMTP_USER y SMTP_PASS en el archivo .env')
      return { success: false, error: 'Configuración de email no disponible' }
    }

    // Validar que la contraseña no sea el placeholder
    if (process.env.SMTP_PASS.includes('TU_CONTRASEÑA') || process.env.SMTP_PASS.includes('AQUÍ')) {
      console.warn('⚠️  La contraseña SMTP parece ser un placeholder. El email no se enviará.')
      return { success: false, error: 'Configuración de email incompleta' }
    }
    
    console.log('📧 Intentando enviar email a:', recipientEmail)
    console.log('📧 Desde:', process.env.SMTP_USER)
    console.log('🔐 SMTP Host:', process.env.SMTP_HOST || 'smtp.gmail.com')

    if (!recipientEmail) {
      console.warn('⚠️  No se especificó un email destinatario')
      return { success: false, error: 'Email destinatario no especificado' }
    }

    // Crear transporter con manejo de errores
    let transporter
    try {
      transporter = createTransporter()
    } catch (transporterError) {
      console.error('❌ Error al crear transporter de email:', transporterError.message)
      return { success: false, error: 'Error al configurar el servicio de email' }
    }

    // Verificar la conexión con manejo de errores específico
    try {
      console.log('🔍 Verificando conexión SMTP...')
      await transporter.verify()
      console.log('✅ Conexión SMTP verificada correctamente')
    } catch (verifyError) {
      console.error('❌ Error al verificar conexión SMTP:', verifyError.message)
      console.error('📋 Código de error:', verifyError.code)
      console.error('📋 Respuesta:', verifyError.response)
      return { success: false, error: `No se pudo conectar con el servidor de email: ${verifyError.message}` }
    }

    // Crear el contenido del email
    const htmlContent = createRSVPEmailTemplate(rsvpData)

    // Ruta del archivo Excel para adjuntar
    const excelFilePath = path.join(__dirname, '../server/data/rsvp.xlsx')
    const attachments = []

    // Si el archivo Excel existe, adjuntarlo
    if (fs.existsSync(excelFilePath)) {
      attachments.push({
        filename: 'rsvp.xlsx',
        path: excelFilePath,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      console.log('📎 Archivo Excel adjuntado al email')
    } else {
      console.warn('⚠️  El archivo Excel no existe, no se adjuntará al email')
    }

    // Configurar el email
    const mailOptions = {
      from: `"Boda Manuela & Daniel" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `💐 Nueva Confirmación de Asistencia - ${rsvpData.name}`,
      html: htmlContent,
      attachments: attachments,
      // Versión de texto plano como alternativa
      text: `
Nueva Confirmación de Asistencia - RSVP

Nombre: ${rsvpData.name}
Email: ${rsvpData.email}
Asistencia: ${rsvpData.attendance === 'yes' ? 'Sí asistirá' : 'No asistirá'}
${rsvpData.attendance === 'yes' ? `Número de invitados: ${rsvpData.guests}` : ''}
${rsvpData.message ? `Mensaje: ${rsvpData.message}` : ''}

Fecha de confirmación: ${new Date(rsvpData.submittedAt).toLocaleString('es-ES')}

${attachments.length > 0 ? '\n📎 Se adjunta el archivo Excel actualizado con todos los RSVPs.' : ''}

---
Sistema de Gestión de RSVP
Manuela & Daniel
      `.trim(),
    }

    // Enviar el email con manejo de errores específico
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

