import { motion } from 'framer-motion'
import { useState } from 'react'
import { Icon } from '@iconify/react'

export default function RSVPCard() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '',
    attendance: 'yes',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [attendanceStatus, setAttendanceStatus] = useState('yes') // Guardar el estado de asistencia

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      // Verificar si la respuesta existe
      if (!response) {
        throw new Error('No se recibió respuesta del servidor')
      }

      // Intentar parsear la respuesta como JSON
      let result
      try {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          result = await response.json()
        } else {
          // Si no es JSON, intentar leer el texto de la respuesta
          const text = await response.text()
          console.error('Respuesta del servidor no es JSON:', text)
          throw new Error('La respuesta del servidor no es válida. Verifica que el servidor esté corriendo correctamente.')
        }
      } catch (parseError) {
        if (parseError.message.includes('La respuesta del servidor no es válida')) {
          throw parseError
        }
        // Si hay un error al parsear JSON, puede ser un error de red o servidor
        if (!response.ok) {
          throw new Error(`Error del servidor (${response.status}): ${response.statusText}`)
        }
        throw new Error('Error al procesar la respuesta del servidor')
      }

      if (response.ok) {
        console.log('RSVP guardado correctamente:', result)
        // Guardar el estado de asistencia antes de resetear el formulario
        setAttendanceStatus(formData.attendance)
        setSubmitted(true)
        // No resetear automáticamente - el usuario debe cerrar manualmente
      } else {
        console.error('Error al guardar RSVP:', result.error || result.message)
        const errorMessage = result.error || result.message || 'Error desconocido'
        alert(`Hubo un error al enviar tu RSVP: ${errorMessage}. Por favor, intenta de nuevo.`)
      }
    } catch (error) {
      console.error('Error al enviar RSVP:', error)
      if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
        alert('Error de conexión: No se pudo conectar con el servidor. Por favor, asegúrate de que el servidor esté corriendo. Ejecuta: npm run server')
      } else if (error.message.includes('La respuesta del servidor no es válida')) {
        alert('Error: La respuesta del servidor no es válida. Por favor, verifica que el servidor esté corriendo correctamente en el puerto 3001.')
      } else {
        alert(`Error: ${error.message}. Por favor, intenta de nuevo o verifica que el servidor esté corriendo.`)
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <motion.section 
      className="min-h-screen py-8 md:py-20 px-4 md:px-6 bg-cream relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Imagen de fondo decorativa */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden opacity-10">
        <img
          src="/assets/arreglo-de-boda.jpg"
          alt="Flores"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl mb-4 text-center text-olive">RSVP</h2>
          <p className="text-center text-lg md:text-xl text-olive/70 mb-12 font-bold">
            Por favor confirma tu asistencia antes del 1 de Julio de 2026
          </p>
          
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl relative"
            >
              <button
                onClick={() => {
                  setSubmitted(false)
                  setFormData({ name: '', email: '', guests: '', attendance: 'yes', message: '' })
                  setAttendanceStatus('yes')
                }}
                className="absolute top-4 right-4 text-olive/60 hover:text-olive transition-colors"
                aria-label="Cerrar mensaje"
              >
                <Icon icon="mdi:close" className="text-2xl md:text-3xl" />
              </button>
              {attendanceStatus === 'yes' ? (
                <>
                  <div className="flex justify-center mb-6">
                    <Icon icon="mdi:check-circle-outline" className="text-6xl text-olive" />
                  </div>
                  <p className="text-2xl md:text-3xl text-olive font-semibold mb-3">¡Mensaje enviado correctamente!</p>
                  <p className="text-lg md:text-xl text-olive/80 mb-4 font-medium">Gracias por confirmar tu asistencia</p>
                  <p className="text-base md:text-lg text-olive/70">Hemos recibido tu confirmación y nos vemos pronto</p>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-6">
                    <Icon icon="mdi:heart-outline" className="text-6xl text-olive/70" />
                  </div>
                  <p className="text-2xl md:text-3xl text-olive font-semibold mb-3">¡Gracias por tu respuesta!</p>
                  <p className="text-lg md:text-xl text-olive/80 mb-4 font-medium">Lamentamos que no puedas acompañarnos</p>
                  <p className="text-base md:text-lg text-olive/70">Tu respuesta ha sido registrada. Te extrañaremos ese día especial</p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-3 md:space-y-6 bg-white/50 backdrop-blur-sm p-4 md:p-12 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-2 border-olive/20 rounded-full px-4 py-2 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive/50 bg-white"
                placeholder="Tu nombre *"
                required
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-2 border-olive/20 rounded-full px-4 py-2 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive/50 bg-white"
                placeholder="Tu email *"
                required
              />
              <div className="flex gap-2 md:gap-4">
                <label className="flex-1 flex items-center justify-center p-2 md:p-4 border-2 border-olive/20 rounded-full cursor-pointer hover:bg-olive/5 transition-colors bg-white">
                  <input
                    type="radio"
                    name="attendance"
                    value="yes"
                    checked={formData.attendance === 'yes'}
                    onChange={handleChange}
                    className="mr-1 md:mr-2"
                  />
                  <span className="text-xs md:text-base">Asistiré</span>
                </label>
                <label className="flex-1 flex items-center justify-center p-2 md:p-4 border-2 border-olive/20 rounded-full cursor-pointer hover:bg-olive/5 transition-colors bg-white">
                  <input
                    type="radio"
                    name="attendance"
                    value="no"
                    checked={formData.attendance === 'no'}
                    onChange={handleChange}
                    className="mr-1 md:mr-2"
                  />
                  <span className="text-xs md:text-base">No asistiré</span>
                </label>
              </div>
              {formData.attendance === 'yes' && (
                <motion.input
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  name="guests"
                  type="number"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full border-2 border-olive/20 rounded-full px-4 py-2 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive/50 bg-white"
                  placeholder="Número de invitados"
                  min="1"
                />
              )}
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border-2 border-olive/20 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-sm md:text-base h-24 md:h-32 resize-none focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive/50 bg-white"
                placeholder="Mensaje (opcional)"
              />
              <motion.button
                type="submit"
                className="w-full bg-olive text-cream rounded-full py-3 md:py-4 text-sm md:text-lg font-semibold hover:bg-olive/90 transition-colors shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Confirmar Asistencia
              </motion.button>
            </motion.form>
          )}
          
          <motion.p 
            className="mt-8 text-center text-sm italic text-olive/70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Gracias desde el fondo de nuestros corazones por ser parte de nuestro día especial.
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  )
}
