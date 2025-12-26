import XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ruta para el archivo Excel
const dataDir = path.join(__dirname, '../server/data')
const excelFile = path.join(dataDir, 'rsvp.xlsx')

/**
 * Crea o actualiza el archivo Excel con los datos de RSVP
 * @param {Array} rsvpData - Array de objetos RSVP
 * @returns {Object} - { success: boolean, message: string }
 */
export function updateExcelFile(rsvpData) {
  try {
    // Asegurar que el directorio existe
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Preparar los datos para Excel
    // Transformar los datos para que sean más legibles en Excel
    const excelData = rsvpData.map(rsvp => ({
      'ID': rsvp.id,
      'Nombre': rsvp.name,
      'Email': rsvp.email,
      'Asistencia': rsvp.attendance === 'yes' ? 'Sí' : 'No',
      'Número de Invitados': rsvp.attendance === 'yes' ? rsvp.guests : '0',
      'Mensaje': rsvp.message || '',
      'Fecha de Confirmación': new Date(rsvp.submittedAt).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }))

    // Crear un libro de trabajo
    const wb = XLSX.utils.book_new()

    // Crear una hoja de datos
    const ws = XLSX.utils.json_to_sheet(excelData)

    // Configurar el ancho de las columnas para mejor visualización
    const colWidths = [
      { wch: 15 }, // ID
      { wch: 25 }, // Nombre
      { wch: 30 }, // Email
      { wch: 15 }, // Asistencia
      { wch: 20 }, // Número de Invitados
      { wch: 40 }, // Mensaje
      { wch: 25 }  // Fecha de Confirmación
    ]
    ws['!cols'] = colWidths

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'RSVP')

    // Escribir el archivo Excel
    XLSX.writeFile(wb, excelFile)

    console.log(`✅ Archivo Excel actualizado: ${excelFile}`)
    console.log(`📊 Total de registros: ${rsvpData.length}`)

    return {
      success: true,
      message: 'Archivo Excel actualizado correctamente',
      filePath: excelFile,
      recordCount: rsvpData.length
    }
  } catch (error) {
    console.error('❌ Error al actualizar archivo Excel:', error)
    return {
      success: false,
      message: 'Error al actualizar archivo Excel',
      error: error.message
    }
  }
}

/**
 * Lee el archivo Excel existente y devuelve los datos
 * @returns {Array} - Array de objetos RSVP o array vacío si no existe
 */
export function readExcelFile() {
  try {
    if (!fs.existsSync(excelFile)) {
      return []
    }

    const workbook = XLSX.readFile(excelFile)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    return data
  } catch (error) {
    console.error('❌ Error al leer archivo Excel:', error)
    return []
  }
}

