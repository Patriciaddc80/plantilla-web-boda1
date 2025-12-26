// Script para actualizar el archivo Excel con los datos existentes en rsvp.json
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { updateExcelFile } from './excelService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rsvpFile = path.join(__dirname, 'data/rsvp.json')

try {
  console.log('🔄 Actualizando archivo Excel...')
  
  // Leer datos existentes
  let data = []
  if (fs.existsSync(rsvpFile)) {
    const fileContent = fs.readFileSync(rsvpFile, 'utf8')
    data = fileContent.trim() ? JSON.parse(fileContent) : []
  }

  if (data.length === 0) {
    console.log('⚠️  No hay datos en rsvp.json. El archivo Excel se creará cuando se agregue el primer RSVP.')
    process.exit(0)
  }

  // Actualizar Excel
  const result = updateExcelFile(data)
  
  if (result.success) {
    console.log(`✅ Archivo Excel actualizado exitosamente`)
    console.log(`📊 Total de registros: ${result.recordCount}`)
    console.log(`📁 Ubicación: ${result.filePath}`)
  } else {
    console.error('❌ Error al actualizar Excel:', result.error)
    process.exit(1)
  }
} catch (error) {
  console.error('❌ Error:', error)
  process.exit(1)
}

