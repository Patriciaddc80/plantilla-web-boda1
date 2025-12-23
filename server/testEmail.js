import 'dotenv/config'
import { sendRSVPEmail } from './emailService.js'

// Datos de prueba
const testRSVP = {
  id: Date.now().toString(),
  name: 'Prueba de Email',
  email: 'test@ejemplo.com',
  guests: '2',
  attendance: 'yes',
  message: 'Este es un mensaje de prueba para verificar que el sistema de email funciona correctamente.',
  submittedAt: new Date().toISOString()
}

const recipientEmail = process.env.RSVP_NOTIFICATION_EMAIL || process.env.SMTP_USER

console.log('🧪 Iniciando prueba de envío de email...')
console.log('📧 Email destinatario:', recipientEmail)
console.log('📧 Email remitente:', process.env.SMTP_USER)
console.log('🔐 SMTP Host:', process.env.SMTP_HOST)
console.log('🔐 SMTP Port:', process.env.SMTP_PORT)

if (!recipientEmail) {
  console.error('❌ No se configuró RSVP_NOTIFICATION_EMAIL o SMTP_USER')
  process.exit(1)
}

sendRSVPEmail(testRSVP, recipientEmail)
  .then(result => {
    if (result.success) {
      console.log('✅ Email de prueba enviado correctamente!')
      console.log('📬 Message ID:', result.messageId)
      console.log('📧 Revisa tu bandeja de entrada:', recipientEmail)
    } else {
      console.error('❌ Error al enviar email de prueba:', result.error)
      if (result.details) {
        console.error('📋 Detalles:', result.details)
      }
    }
    process.exit(result.success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Error inesperado:', error)
    process.exit(1)
  })

