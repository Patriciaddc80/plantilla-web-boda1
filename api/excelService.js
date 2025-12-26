import XLSX from 'xlsx'

/**
 * Genera un archivo Excel en memoria (Buffer) con los datos de RSVP
 * @param {Array} rsvpData - Array de objetos RSVP
 * @returns {Buffer} - Buffer del archivo Excel
 */
export function generateExcelBuffer(rsvpData) {
  try {
    // Preparar los datos para Excel
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

    // Generar el buffer del archivo Excel (en memoria, no en disco)
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    console.log(`✅ Archivo Excel generado en memoria: ${rsvpData.length} registros`)

    return excelBuffer
  } catch (error) {
    console.error('❌ Error al generar archivo Excel:', error)
    throw error
  }
}

