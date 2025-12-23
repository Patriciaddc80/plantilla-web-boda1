import nodemailer from 'nodemailer'
import { createRSVPEmailTemplate } from './emailTemplate.js'

// Configuración del transporter de email
// Puedes usar Gmail, Outlook, o cualquier otro servicio SMTP
const createTransporter = () => {
  // Configuración usando variables de entorno
  // Para Gmail, necesitarás una "Contraseña de aplicación" en lugar de tu contraseña normal
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER, // Tu email
      pass: process.env.SMTP_PASS, // Tu contraseña o contraseña de aplicación
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
      await transporter.verify()
    } catch (verifyError) {
      console.error('❌ Error al verificar conexión SMTP:', verifyError.message)
      return { success: false, error: 'No se pudo conectar con el servidor de email' }
    }

    // Crear el contenido del email
    const htmlContent = createRSVPEmailTemplate(rsvpData)

    // Configurar el email
    const mailOptions = {
      from: `"Boda Manuela & Daniel" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `💐 Nueva Confirmación de Asistencia - ${rsvpData.name}`,
      html: htmlContent,
      // Versión de texto plano como alternativa
      text: `
Nueva Confirmación de Asistencia - RSVP

Nombre: ${rsvpData.name}
Email: ${rsvpData.email}
Asistencia: ${rsvpData.attendance === 'yes' ? 'Sí asistirá' : 'No asistirá'}
${rsvpData.attendance === 'yes' ? `Número de invitados: ${rsvpData.guests}` : ''}
${rsvpData.message ? `Mensaje: ${rsvpData.message}` : ''}

Fecha de confirmación: ${new Date(rsvpData.submittedAt).toLocaleString('es-ES')}

---
Sistema de Gestión de RSVP
Manuela & Daniel
      `.trim(),
    }

    // Enviar el email con manejo de errores específico
    try {
      const info = await transporter.sendMail(mailOptions)
      console.log('✅ Email enviado correctamente:', info.messageId)
      return { success: true, messageId: info.messageId }
    } catch (sendError) {
      console.error('❌ Error al enviar email:', sendError.message)
      return { 
        success: false, 
        error: sendError.message || 'Error desconocido al enviar email'
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

