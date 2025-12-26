// Script para probar el envío de email con datos de RSVP similares a los reales
import 'dotenv/config'
import { sendRSVPEmail } from './emailService.js'
import { updateExcelFile } from './excelService.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rsvpFile = path.join(__dirname, 'data/rsvp.json')

console.log('🧪 Iniciando prueba de email con datos reales de RSVP...\n')

// Leer datos existentes
let allData = []
if (fs.existsSync(rsvpFile)) {
  const fileContent = fs.readFileSync(rsvpFile, 'utf8')
  allData = fileContent.trim() ? JSON.parse(fileContent) : []
  console.log(`📊 Total de RSVPs existentes: ${allData.length}`)
}

// Crear un RSVP de prueba con los últimos datos
const testRSVP = allData.length > 0 
  ? allData[allData.length - 1] // Usar el último RSVP real
  : {
      id: Date.now().toString(),
      name: 'Test Usuario',
      email: 'test@example.com',
      guests: '2',
      attendance: 'yes',
      message: 'Mensaje de prueba',
      submittedAt: new Date().toISOString()
    }

console.log('📧 Datos del RSVP de prueba:')
console.log(JSON.stringify(testRSVP, null, 2))
console.log('')

// Actualizar Excel primero
if (allData.length > 0) {
  console.log('📊 Actualizando archivo Excel...')
  const excelResult = updateExcelFile(allData)
  if (excelResult.success) {
    console.log(`✅ Excel actualizado: ${excelResult.recordCount} registros\n`)
  } else {
    console.error('❌ Error al actualizar Excel:', excelResult.error)
  }
}

// Enviar email
const recipientEmail = process.env.RSVP_NOTIFICATION_EMAIL || process.env.SMTP_USER
console.log(`📧 Enviando email a: ${recipientEmail}`)
console.log('')

sendRSVPEmail(testRSVP, recipientEmail)
  .then(result => {
    if (result.success) {
      console.log('✅ Email enviado correctamente!')
      console.log('📬 Message ID:', result.messageId)
      console.log('')
      console.log('📋 Verifica:')
      console.log('1. Tu bandeja de entrada: patriciaddc80@gmail.com')
      console.log('2. La carpeta de SPAM/Correo no deseado')
      console.log('3. El archivo Excel debe estar adjunto')
    } else {
      console.error('❌ No se pudo enviar el email:', result.error)
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('❌ Error al enviar email:', error)
    process.exit(1)
  })

